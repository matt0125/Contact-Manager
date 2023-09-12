const searchInput = document.getElementById("search-input");
const searchIcon = document.getElementById("search-icon");
//const tableKey = 'cm-tbl';

searchIcon.addEventListener("click", function (){
    const searchTerm = searchInput.value;
    if(searchTerm.trim() !== ""){
        alert('Searching for: ${searchTerm}');
    }
    else{
        alert("Please enter a search term.");
    }
});

fetch('http://poosd-project.com/LAMPAPI/Login.php')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById()

        data.forEach(account => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${account.id}</td}
                <td>${account.name}</td>
                <td>${account.balance}</td>
                `;
                tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error: ', error);
    });




