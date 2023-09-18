
<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "API_User", "API_Password", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $firststmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $firststmt->bind_param("s", $inData["login"]);
        $firststmt->execute();
		$result = $firststmt->get_result();

        if( $row = $result->fetch_assoc() )
        {
            returnWithError("Username already taken.");
            $firststmt->close();
        }
        else
        {
            $stmt = $conn->prepare("INSERT INTO Users (firstname, lastname, Login, Password) VALUES (?,?,?,?)");
            $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
            $stmt->execute();

            $check = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
            $check->bind_param("ss", $inData["login"], $inData["password"]);
            $check->execute();
            $result = $check->get_result();
    
            if( $row = $result->fetch_assoc()  )
            {
                returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
            }
            else
            {
                returnWithError("Error creating record.");
            }
    
            $stmt->close();
        }
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
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
