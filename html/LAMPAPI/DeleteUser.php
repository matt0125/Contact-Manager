
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
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
        $stmt->bind_param("s", $inData["userid"]);
        $stmt->execute();
		$result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            $delete = $conn->prepare("delete from Contacts Where userID =?" );
            $delete->bind_param( "s", $inData["userid"] );

            if ($delete->execute()) 
			{
				$deleteUser = $conn->prepare("delete from Users where ID =?");
                $deleteUser->bind_param( "s", $inData["userid"] );

                if ( $deleteUser->execute() ) 
                {
                    returnWithInfo("User deleted");
                }
                else
                {
                    returnWithError( "Error deleting row: " . $deleteUser->error );
                }
                $deleteUser->close();
			} 
            else 
			{
				returnWithError( "Error deleting row: " . $delete->error );
			}

            $delete->close();
		}
		else
		{
			returnWithError("User does not exist");
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