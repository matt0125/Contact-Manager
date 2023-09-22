const searchInput = document.getElementById("search-input");
const searchIcon = document.getElementById("search-icon");
const searchResults = document.getElementById("search-results");

searchIcon.addEventListener("click", async () => {
    const searchTerm = searchInput.value.trim();

    if(searchTerm.trim() !== ""){
        try {
            //API call to look for accounts
            const searchResultsData = await searchAccounts(searchTerm);

            // displays search results
            displaySearchResults(searchResultsData);
        } catch (error) {
            console.error("Error searching for accoutns:", error);
        }
    }
    else{
        alert("Please enter a search term.");
    }
});

async function searchAccounts(searchTerm) {
    const response = await fetch("http://poosd-project.com/LAMPAPI/Search/Contacts.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ searchTerm }),
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Failed to search for accounts.");
    }
}

// function that displays search results
function displaySearchResults(data) {
    // clears previous search results
    searchResults.innerHTML = "";

    if (data && data.length > 0){
        data.forEach((account) => {
            const resultItem = document.createElement("div");
            resultItem.textContent = `${account.firstName} ${account.lastName}`;
            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.textContent = "No results found.";
    }
}

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

document.querySelectorAll(".sortable-header").forEach(function (header) {
    header.addEventListener("click", function () {
        var icon = this.querySelector("i");
        var colWords = this.textContent.trim();
        var col;
        switch (colWords) {
            case "First Name":
                col = "firstname";
                break;
            case "Last Name":
                col = "lastname";
                break;
            case "Phone":
                col = "phone";
                break;
            case "Email":
                col = "email";
                break;
            default:
                break;
        }

        var direction = "ASC";

        // Determine the sorting direction based on the icon
        if (icon.classList.contains("fa-sort-up")) {
            direction = "DESC";
        }

        // Reset all other sorting icons to "fa-sort"
        document.querySelectorAll(".sortable-header").forEach(function (otherHeader) {
            if (otherHeader !== header) {
                var otherIcon = otherHeader.querySelector("i");
                otherIcon.classList.remove("fa-sort-up", "fa-sort-down");
                otherIcon.classList.add("fa-sort");
            }
        });

        if (icon.classList.contains("fa-sort")) {
            // If the icon is not sorted, change it to "fa-sort-up"
            icon.classList.remove("fa-sort");
            icon.classList.add("fa-sort-up");
        } else if (icon.classList.contains("fa-sort-up")) {
            // If the icon is "fa-sort-up", change it to "fa-sort-down"
            icon.classList.remove("fa-sort-up");
            icon.classList.add("fa-sort-down");
        } else if (icon.classList.contains("fa-sort-down")) {
            // If the icon is "fa-sort-down", change it to "fa-sort-up"
            icon.classList.remove("fa-sort-down");
            icon.classList.add("fa-sort-up");
        }

        // Call the sortBy function with parameters
        sortBy(col, direction);

        // You can perform other actions here as needed
    });
});

async function sortBy(col, direction) {
    
    userId = readCookie("userId");
    if (!userId) {
        throw new Error("User ID is not provided.");
    }

    if (typeof userId !== "string" && typeof userId !== "number") {
        throw new Error("Invalid User ID type. Expected string or number.");
    }
    
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userid": userId,
            "sorton": col,
            "sortdirection": direction
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        const response = await fetch("http://poosd-project.com/LAMPAPI/Search/Contacts.php", requestOptions);

        if (response.ok) {
            const data = await response.json();
            
            try {
                document.getElementById("contactList").innerHTML = '';
                for (const contact of data.result) {
                    addContactToTable(contact);
                }
            } catch (error) {
                console.error("Error in populateContacts:", error.message);
            }
        } else {
            throw new Error("Failed to sort contacts.");
        }
    } 
    catch (error) {
        throw error;
    }

}

function addContactToTable(contact){
    const contactList = document.getElementById('contactList');
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-contact-id', contact.contactid); // THis stores the contact ID
    newRow.innerHTML = `
        <td>${contact.firstname}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>
        
            <i onclick="editContact(event, true)" class="fa-solid fa-pen"></i>
            <i onclick="deleteContact(event)" class="fa-regular fa-trash-can"></i>
        </td>
    `;
    contactList.appendChild(newRow);
    console.log('Added contact to the table:', contact);
}


function editContact(event, show){
    var overlay = document.getElementById('overlay');
    var modal = document.getElementById('contactModal');

    var editBtn = document.getElementById('editBtn');
    var createBtn = document.getElementById('submitBtn');

    if(show === true){
        const rowElement = event.target.closest("tr");
        const contactId = rowElement.dataset.contactId;

        console.log("edit showing true");
        overlay.style.display = "block";
        modal.style.display = "block";
        editBtn.style.display = "block";
        createBtn.style.display = "none";

        populateFields(contactId);
    }
    else {
        overlay.style.display = "none";
        modal.style.display = "none";
        editBtn.style.display = "none";
        createBtn.style.display = "block";

        clearFields();
    }
}

async function getContactById(contactId)
{
    var userId = readCookie("userId");
    // "userid" "contactid"
    
    if (!userId) {
        throw new Error("User ID is not provided.");
    }
    if (typeof userId !== "string" && typeof userId !== "number") {
        throw new Error("Invalid User ID type. Expected string or number.");
    }
    
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userid": userId.toString(),
            "contactid": contactId.toString()
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        const response = await fetch("http://poosd-project.com/LAMPAPI/Get/Contact.php", requestOptions);

        if (response.ok) {
            var data = await response.json();

            const result = {
                firstName: data.result.firstname,
                lastName: data.result.lastName,
                phone: data.result.phone,
                email: data.result.email,
                id: data.result.contactid
            }

            return result;
        } else {
            throw new Error("Failed to fetch contact.");
        }
    } 
    catch (error) {
        throw error;
    } 
}

async function populateFields(contactId){
    // get contact
    const contact = await getContactById(contactId);
    
    // update fields
    document.getElementById('firstNameInput').value = contact.firstName;
    document.getElementById('lastNameInput').value = contact.lastName;
    document.getElementById('phoneInput').value = contact.phone;
    document.getElementById('emailInput').value = contact.email;
}

document.getElementById('editBtn').addEventListener('click', () => {
    updateContact(document.getElementById('contactIdField').value);
});

async function updateContact(contactId){
    try {
        var requestBody = {
            userid: readCookie("userId"),
            contactid: contactId,
            firstName: document.getElementById('firstNameInput').value,
            lastName: document.getElementById('lastNameInput').value,
            phone: document.getElementById('phoneInput').value,
            email: document.getElementById('emailInput').value
        };

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody),
            redirect: 'follow'
        };

        const response = await fetch("http://poosd-project.com/LAMPAPI/EditContact.php", requestOptions);

        if (response.ok) {
            const data = await response.json();
            if(data.status === "Success") {
                console.log("Contact updated successfully.");
                editContact(contactId, true);
                populateContacts();
            } else {
                console.log("Failed to update contact:", data.error || "");
                return false;
            }
        } else {
            throw new Error("Failed to update contact.");
        }
    } catch (error) {
        console.error("Error while updating contact:", error);
        return false;
    }
}

function clearFields() {
    document.getElementById('firstNameInput').value = "";
    document.getElementById('lastNameInput').value = "";
    document.getElementById('phoneInput').value = "";
    document.getElementById('emailInput').value = "";
}


function deleteContact(event){
    // Show are you sure form
    const confirmed = confirm("Are you sure you want to delete this contact?");

    const rowElement = event.target.closest("tr");
    const contactId = rowElement.dataset.contactId;
    // then delete
    if (confirmed){
        deleteContactExec(contactId);
    }
}

async function deleteContactExec(contactId){
    userId = readCookie("userId");

    if(!confirmed){
        return;
    }
    
    if (!userId) {
        throw new Error("User ID is not provided.");
    }
    if (typeof userId !== "string" && typeof userId !== "number") {
        throw new Error("Invalid User ID type. Expected string or number.");
    }
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userid": userId,
            "contactid": contactId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }
        console.log("Body " + requestOptions.body);

        const response = await fetch("http://poosd-project.com/LAMPAPI/DeleteContact.php", requestOptions);

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            throw new Error("Failed to delete contact.");
        }
    } 
    catch (error) {
        throw error;
    }
    populateContacts();
}

async function populateContacts() {
    document.getElementById("contactList").innerHTML = '';
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

// Add contact form
function toggleAddContact() {
    var overlay = document.getElementById('overlay');
    var modal = document.getElementById('contactModal');
    
    overlay.style.display = overlay.style.display === "none" ? "block" : "none";
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}

document.getElementById('addContactBtn').addEventListener('click', toggleAddContact);
document.getElementById('closeForm').addEventListener('click', toggleAddContact);

// Create contact button functionality
document.getElementById('submitBtn').addEventListener('click', async function(e) {
    e.preventDefault();

    var firstName = document.getElementById('firstNameInput').value;
    var lastName = document.getElementById('lastNameInput').value;
    var phone = document.getElementById('phoneInput').value;
    var email = document.getElementById('emailInput').value;

    const enteredEmail = email.value.trim();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "userid": readCookie("userId"),
        "firstname": firstName,
        "lastname": lastName,
        "phone": phone,
        "email": email
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("http://poosd-project.com/LAMPAPI/CreateContact.php", requestOptions);
        const result = await response.json();

        if (result.status === "Success") {
            console.log("successfully added contact");
            toggleAddContact();
            clearFields();
            populateContacts();
        } else {
            console.log("Failed to add contact", result.error || "");
        }
    } catch (error) {
        console.log('Error occurred:', error);
    }
});

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

// Logout
document.getElementById('logout-button').addEventListener('click', () => {
    document.cookie = "userId=; expires=01 Jan 1970 00:00:00 UTC;";
    document.cookie = "firstName=; expires=01 Jan 1970 00:00:00 UTC;";
    document.cookie = "lastName=; expires=01 Jan 1970 00:00:00 UTC;";
    window.location.href = 'index.html'
});
