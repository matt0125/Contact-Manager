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

function fetchAccInfo() {
    const apiURL = 'poosd-project.com/LAMPAPI/Get/Contacts.php';

    fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.getElementById('contactList');

            tableBody.innerHTML = '';

            data.forEach((account) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${account.firsName}</td>
                    <td>${account.lastName}</td>
                    <td>${account.phone}</td>
                    <td>${account.email}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

fetchAccountData();



