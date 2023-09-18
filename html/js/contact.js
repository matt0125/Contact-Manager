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
    newRow.innerHTML = `
        <td>${contact.firstname}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td><i class="fa-solid fa-pen"></i>
        <i onclick="deleteContact(${contact.contactid})" class="fa-regular fa-trash-can"></i></td>
    `;
    contactList.appendChild(newRow);
    console.log('Added contact to the table:', contact);
}

function deleteContact(contactId){
    // Show are you sure form

    // then delete
    deleteContactExec(contactId);
}

async function deleteContactExec(contactId){
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
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    var firstName = document.getElementById('firstNameInput').value;
    var lastName = document.getElementById('lastNameInput').value;
    var phone = document.getElementById('phoneInput').value;
    var email = document.getElementById('emailInput').value;

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


