
<?php

	$inData = getRequestInfo();
	
	$status = "";

	$conn = new mysqli("localhost", "API_User", "API_Password", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        if( userCheck( $conn, $inData["userid"]) !== false)
        {
            returnWithArray( getSpecificContacts( $conn, $inData["userid"], $inData["search"]) );
        }
        else
        {
            returnWithError("No user associated with provided userid");
        }
		$conn->close();
	}
	
    function userCheck( $conn, $userId )
    {
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
		$result = $stmt->get_result();

        if( $row = $result->fetch_assoc() )
        {
            $stmt->close();
            return $row;
        }
        else
        {
            $stmt->close();
            return false;
        }
    }

    function getSpecificContacts( $conn, $userId, $search )
    {
        $searchTerm = '%' . $search . '%';
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userId=? AND (firstName LIKE ? OR lastName LIKE ? OR phone LIKE ? OR email LIKE ?)");
        $stmt->bind_param("sssss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
        $stmt->execute();
		$result = $stmt->get_result();

        $stmt->close();
        return $result;
    }

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"status":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $status )
	{
		$retValue = '{"status":' . $status . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithArray( $result )
	{
		$retValue = '{';
        
        while( $row = $result->fetch_assoc())
        {
            $retValue .= '{"contactid":"' . $row['ID'] . '","firstname":"'  . $row['FirstName'] . '","lastName":"' . $row['LastName'] . '","phone":"' . $row['Phone'] . '","email":"' . $row['Email'] . '"}';
        }
        
        $retValue .= '}';

		sendResultInfoAsJson( $retValue );
	}
	
?>
