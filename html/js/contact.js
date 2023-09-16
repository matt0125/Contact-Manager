const searchInput = document.getElementById("search-input");
const searchIcon = document.getElementById("search-icon");

searchIcon.addEventListener("click", function (){
    const searchTerm = searchInput.value;
    if(searchTerm.trim() !== ""){
        alert('Searching for: ${searchTerm}');
    }
    else{
        alert("Please enter a search term.");
    }
});

async function getContacts(userId) {
    if (!userId) {
        throw new Error("User ID is not provided.");
    }
    if (typeof userId !== "string" && typeof userId !== "number") {
        throw new Error("Invalid User ID type. Expected string or number.");
    }
    console.log("User Id: " + userId + " is a type " + typeof userId);
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userid": userId.toString()
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        const response = await fetch("http://poosd-project.com/LAMPAPI/Get/Contacts.php", requestOptions);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Failed to fetch contacts.");
        }
    } 
    catch (error) {
        throw error;
    }
}

function addContactToTable(contact){
    const contactList = document.getElementById('contactList');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${contact.firstname}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>Actions</td>
    `;
    contactList.appendChild(newRow);
    console.log('Added contact to the table:', contact);
}

async function populateContacts() {
    let userId = readCookie("userId");
    if (userId) {
        try {
            const contacts = await getContacts(userId);
            for (const contact of contacts.result) {
                addContactToTable(contact);
            }
        } catch (error) {
            console.error("Error in populateContacts:", error.message);
        }
    } else {
        console.error("UserId not found in cookies.");
    }
    
}

populateContacts();

// Add contact

// Returns value of associated cookie name. If Cookie name doesn't exist, returns null.
function readCookie(cookieName) {
    let cookieArray = document.cookie.split(';');

    for (let cookieString of cookieArray) {
        let [name, value] = cookieString.trim().split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}


