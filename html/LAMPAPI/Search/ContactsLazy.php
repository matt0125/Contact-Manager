
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
        if( userCheck( $conn, $inData[ "userid" ]) !== false )
        {
            returnWithArray( getSpecificLazyContacts( $conn, $inData["userid"], $inData["index"], $inData["list size"], $inData["search"] ) );
        }
        else
        {
            returnWithError( "No user associated with provided userid" );
        }
		$conn->close();
	}
	
    function userCheck( $conn, $userId )
    {
        $stmt = $conn->prepare( "SELECT ID FROM Users WHERE ID=?" );
        $stmt->bind_param( "s", $userId );
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

    function getSpecificLazyContacts( $conn, $userId, $upper, $lower, $specificSearch )
    {
        $searchTerm = '%' . $specificSearch . '%';
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userID=? AND ( lastName LIKE ? OR firstName LIKE ? OR phone LIKE ? OR email LIKE ? ) LIMIT ?, ?" );
        $stmt->bind_param( "sssssss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $upper, $lower);
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
		$retValue = '{"result":[';

            $firstrow = true;
        
            
            while( $row = $result->fetch_assoc())
            {
                if($firstrow)
                {
                    $firstrow = false;
                }
                else
                {
                    $retValue .= ',';
                }
                $retValue .= '{"contactid":"' . $row['ID'] . '","firstname":"'  . $row['FirstName'] . '","lastName":"' . $row['LastName'] . '","phone":"' . $row['Phone'] . '","email":"' . $row['Email'] . '"}';
            }
            
            $retValue .= '], "error":""}';
    
            sendResultInfoAsJson( $retValue );
	}
	
?>
