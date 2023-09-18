
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
            if(isset($inData["sorton"]))
            {
                if( verifyParams($inData["sorton"], $inData["sortdirection"]))
                {
                    returnWithArray( getSortedSpecificContacts( $conn, $inData["userid"], $inData["search"], $inData["sorton"], $inData["sortdirection"]) );
                }
            }
            else
            {
                returnWithArray( getSpecificContacts( $conn, $inData["userid"], $inData["search"]) );
            }
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
    function verifyParams( $sortOn, $sortDirection )
    {
        $error = '';
        $validSortOn = ['contactid', 'phone', 'email', 'firstname', 'lastname'];
        $validSortDirection = ['', 'ASC', 'DESC'];

        if( !in_array( strtolower($sortOn), $validSortOn ) )
        {
            $error .= 'sorton paramater not valid, must be one of the following: [' . implode(', ', $validSortOn) . ']';
        }

        if( !in_array(strtoupper($sortDirection), $validSortDirection) )
        {
            if( $error != '')
            {
                $error .= '; ';
            }

            $error .= 'sortdirection paramater not valid, must be one of the following: [' . implode(', ', ['ASC', 'DESC']) . ']';
        }
        

        if( $error != '')
        {
            returnWithError($error);
        }
        else
        {
            return true;
        }
    }
    function getSortedSpecificContacts( $conn, $userId, $search, $sortOn, $sortDirection )
    {
        $searchTerm = '%' . $search . '%';
        $sortTerm = $sortOn . ' ' . $sortDirection;
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userId=? AND (firstName LIKE ? OR lastName LIKE ? OR phone LIKE ? OR email LIKE ?) ORDER BY $sortTerm");
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
