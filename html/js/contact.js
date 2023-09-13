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

async function getContacts(){
    try{
        const response = await fetch('API_ENDPOINT', requestOptions);
        const data = await response.json();
        console.log('Successfully fetched contacts:', data);
        return data;
    } 
    catch (error) {
        console.error("Error fetching contacts:", error.message);
        return null;
    }
}

const result = await login(username, password);
if(result.success){
    const contacts = await getContacts();
    if(contacts){
        for(const contact of contacts) {
            addContactToTable(contact);
        }
    }
    else {
        console.error('Failed to fetch contacts.');
    }
}

function addContactToTable(contact){
    const contactList = document.getElementById('contactList');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>Actions</td>
    `;
    contactList.appendChild(newRow);
    console.log('Added contact to the table:', contact);
}

fetchAccountData();



