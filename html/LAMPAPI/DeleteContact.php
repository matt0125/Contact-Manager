
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
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID=?");
        $stmt->bind_param("s", $inData["id"]);
        $stmt->execute();
		$result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            $delete = $conn->prepare("delete from Contacts Where ID =?" );
            $delete->bind_param( "s", $inData["id"] );

            if ($delete->execute()) 
			{
				returnWithInfo( "Contact deleted" );
			} else 
			{
				returnWithError( "Error deleting row: " . $delete->error );
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
		$retValue = '{"status":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $status )
	{
		$retValue = '{"status":' . $status . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
