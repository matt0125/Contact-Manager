
<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");

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
            returnWithArray( getAllContacts( $conn, $inData["userid"]) );
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

    function getAllContacts( $conn, $userId )
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userId=?");
        $stmt->bind_param("s", $userId);
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
