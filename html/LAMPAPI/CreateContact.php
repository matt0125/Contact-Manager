
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
		$usercheck = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
        $usercheck->bind_param("s", $inData["userid"]);
        $usercheck->execute();
		$result = $usercheck->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            $stmt = $conn->prepare("INSERT INTO Contacts (firstName, lastName, phone, email, userID) VALUES (?,?,?,?,?)");
			$stmt->bind_param("sssss", $inData["firstname"], $inData["lastname"], $inData["phone"], $inData["email"], $inData["userid"]);
			
			if( $stmt->execute() )
			{
				returnWithInfo("Success");
			}
			else
			{
				returnWithError("Error creating record: " . $stmt->error );
			}

		}
        else
        {
            returnWithError("Error creating record: No user associated with provided userid");
        }
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
