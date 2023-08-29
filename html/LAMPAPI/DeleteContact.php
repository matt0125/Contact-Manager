
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
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE FirstName=? AND LastName=? AND Phone=? AND Email=? AND UserID=?");
        $stmt->bind_param("sssss", $inData["firstname"], $inData["lastname"], $inData["phone"], $inData["email"], $indata["userid"]);
        $stmt->execute();
		$result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            $delete = $conn->prepare("delete from Users Where ID =?" );
            $delete->bind_param("s", $row['ID'] );
            $delete->execute();
            $result = $delte->get_result();
            
            if($row = $result->fetch_assoc())
            {
                returnWithInfo("Contact deleted");
            }
            else
            {
                returnWithError("Error deleting contact");
            }
            $delete->close();
		}
		else
		{
			returnWithError("Contact does not exist");
		}

		$stmt->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $status )
	{
		$retValue = '{"status":' . $status . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>