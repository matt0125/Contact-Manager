
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
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
		$usercheck = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
        $usercheck->bind_param("s", $inData["userid"]);
        $usercheck->execute();
		$result = $usercheck->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            $contactcheck = $conn->prepare("SELECT ID FROM Contacts WHERE ID =?");
            $contactcheck->bind_param("s", $inData["contactid"]);
            $contactcheck->execute();
            $result2 = $contactcheck->get_result();

            if( $row2 = $result2->fetch_assoc()  )
            {
                $contactcheck2 = $conn->prepare("SELECT ID FROM Contacts WHERE ID =? AND UserID = ?");
                $contactcheck2->bind_param("ss", $inData["contactid"], $inData["userid"]);
                $contactcheck2->execute();
                $result3 = $contactcheck2->get_result();
                if( $row3 = $result3->fetch_assoc()  )
                {
                    $stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?, phone = ?, email = ? WHERE ID = ?");
                    $stmt->bind_param("sssss", $inData["firstname"], $inData["lastname"], $inData["phone"], $inData["email"], $inData["contactid"]);
    
                    if($stmt->execute())
                    {
                        returnWithInfo("Contact updated successfully");
                    }
                    else
                    {
                        returnWithError("Error updating record:" . $stmt->error);
                    }
                }
                else
                {
                    returnWithError("User does not own contact with that contactid");
                }

            }
            else
            {
                returnWithError("Contact does not exist");
            }

		}
        else
        {
            returnWithError("No user associated with provided userid");
        }
        $stmt->close();
        $contactcheck2->close();
        $contactcheck->close();
        $usercheck->close();
		$conn->close();
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
		$retValue = '{"status":"' . $status . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
