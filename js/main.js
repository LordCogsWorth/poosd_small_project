
function filterContacts() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#contactTable tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const phone = row.cells[1].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();
        if (name.includes(searchQuery) || phone.includes(searchQuery) || email.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function editContact(id) {
    // Fetch contact details by ID (from backend or local storage)
    const contact = getContactById(id); // Implement this function
    document.getElementById('contactFirstName').value = contact.firstName;
    document.getElementById('contactLastName').value = contact.lastName;
    document.getElementById('contactCompany').value = contact.company;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactNotes').value = contact.notes;

    // Change the form to "Update" mode
    document.getElementById('addContact').textContent = 'Update Contact';
    document.getElementById('addContact').onclick = () => updateContact(id);
}

function updateContact(id) {
    // Get updated values from the form
    const updatedContact = {
        firstName: document.getElementById('contactFirstName').value,
        lastName: document.getElementById('contactLastName').value,
        company: document.getElementById('contactCompany').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        notes: document.getElementById('contactNotes').value,
    };

    // Send updated contact to the backend
    fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact),
    }).then(() => loadContacts()); // Refresh the table
}

function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        fetch(`/api/contacts/${id}`, {
            method: 'DELETE',
        }).then(() => loadContacts()); // Refresh the table
    }
}

function addContact() {
    const newContact = {
        firstName: document.getElementById('contactFirstName').value,
        lastName: document.getElementById('contactLastName').value,
        company: document.getElementById('contactCompany').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        notes: document.getElementById('contactNotes').value,
    };

    fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
    }).then(() => {
        loadContacts(); // Refresh the table
        document.getElementById('addContactForm').reset(); // Clear the form
    });
}

function loadContacts() {
    fetch('/api/contacts')
        .then(response => response.json())
        .then(contacts => {
            const tableBody = document.getElementById('contactTable');
            tableBody.innerHTML = ''; // Clear existing rows
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.firstName} ${contact.lastName}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.company}</td>
                    <td>${contact.email}</td>
                    <td>${contact.notes}</td>
                    <td>
                        <button onclick="editContact('${contact.id}')">Edit</button>
                        <button onclick="deleteContact('${contact.id}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

 function loadContacts() {
            console.log('Refreshing table...'); // Debugging log
            const tableBody = document.getElementById('contactTable');
            tableBody.innerHTML = ''; // Clear existing rows
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', contact.id); // Add data-id attribute for editing
                row.innerHTML = `
                    <td>${contact.firstName} ${contact.lastName}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.company}</td>
                    <td>${contact.email}</td>
                    <td>${contact.notes}</td>
                    <td>
                        <button onclick="editContact('${contact.id}')"> <i class="fas fa-edit"></i></button>
                        <button onclick="deleteContact('${contact.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

document.getElementById('viewContactsBtn').addEventListener('click', () => {
    document.getElementById('contactsView').style.display = 'block';
    document.getElementById('addContactView').style.display = 'none';
});

document.getElementById('addContactViewBtn').addEventListener('click', () => {
    document.getElementById('contactsView').style.display = 'none';
    document.getElementById('addContactView').style.display = 'block';
});