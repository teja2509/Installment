
let submissionCount = 0; // Counter for numbering submissions

// Function to save submitted data to localStorage
function saveToLocalStorage(data) {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.push(data);
    localStorage.setItem('submissions', JSON.stringify(submissions));
}

function markAsPaid(count) {
  const paidKey = `paidDate_${count}`;
  const isPaidKey = `isPaid_${count}`;

  // Check if the submission is already paid
  if (localStorage.getItem(isPaidKey)) {
    return;
  }

  // Set the paid date and update the UI
  const currentDate = new Date().toLocaleDateString();
  localStorage.setItem(paidKey, currentDate);
  localStorage.setItem(isPaidKey, "true");

  // Update the UI immediately
  const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
  const paidDateParagraph = document.createElement("p");
  paidDateParagraph.innerHTML = `<strong>Paid Date:</strong> ${currentDate}`;


  // Remove the remaining days message
  const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
  if (remainingDaysMessage) {
    remainingDaysMessage.remove();
  }
  
  // Check if there is an existing paid date paragraph and update it
  const existingPaidDateParagraph = submissionBox.querySelector('.paidDateParagraph');
  if (existingPaidDateParagraph) {
    existingPaidDateParagraph.innerHTML = paidDateParagraph.innerHTML;
  } else {
    // If not, insert the new paid date paragraph
    submissionBox.insertBefore(paidDateParagraph, submissionBox.querySelector('.buttonsContainer'));
  }

  // Hide the "Paid" and "Edit" buttons
  const paidButton = submissionBox.querySelector('button:nth-of-type(1)'); // Assuming "Paid" is the first button
  const editButton = submissionBox.querySelector('button:nth-of-type(2)'); // Assuming "Edit" is the second button
  paidButton.style.display = 'none';
  editButton.style.display = 'none';

  // Display "Paid Successfully" message
  const paidSuccessfullyMessage = document.createElement("p");
  paidSuccessfullyMessage.textContent = "Paid Successfully!";
  paidSuccessfullyMessage.style.color = "green"; // Set the color to green or your preferred color
  submissionBox.appendChild(paidSuccessfullyMessage);

  // Set a timeout to remove the message after 3 seconds
  setTimeout(() => {
    paidSuccessfullyMessage.remove();
  }, 3000);
}

function deleteSubmission(count) {
  // Show a confirmation dialog
  const isConfirmed = window.confirm("Are you sure you want to delete this submission?");

  if (isConfirmed) {
    // Remove the submission data from localStorage
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.splice(count - 1, 1); // Subtract 1 to match array index
    localStorage.setItem('submissions', JSON.stringify(submissions));

    // Remove related data (paid date and isPaid status)
    localStorage.removeItem(`paidDate_${count}`);
    localStorage.removeItem(`isPaid_${count}`);

    // Display a message in the submission box for 3 seconds
    const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
    const deleteMessage = document.createElement("p");
    deleteMessage.textContent = "Data deleted successfully.";
    deleteMessage.style.color = "red"; // Set the color to red or your preferred color
    submissionBox.appendChild(deleteMessage);

    // Set a timeout to remove the message and the submission box after 3 seconds
    setTimeout(() => {
      deleteMessage.remove();
      submissionBox.remove();
    }, 3000);
  } else {
    // Display a message in the submission box for 3 seconds
    const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
    const cancelMessage = document.createElement("p");
    cancelMessage.textContent = "Data was not deleted.";
    cancelMessage.style.color = "green"; // Set the color to green or your preferred color
    submissionBox.appendChild(cancelMessage);

    // Set a timeout to remove the message after 3 seconds
    setTimeout(() => {
      cancelMessage.remove();
    }, 3000);
  }
}











function loadFromLocalStorage() {
  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

  // Clear existing content in the submittedDataContainer
  const submittedDataContainer = document.getElementById("submittedDataContainer");
  submittedDataContainer.innerHTML = '';

  // Display existing submissions on page load
  submissions.forEach((submission, index) => {
    const newSubmissionDiv = createSubmissionBox(submission, index + 1);
    submittedDataContainer.appendChild(newSubmissionDiv);

    // Check if the submission is marked as paid
    const isPaid = localStorage.getItem(`isPaid_${index + 1}`);
    if (isPaid === "true") {
      // Remove the remaining days message
      const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${index + 1})`);
      const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
      if (remainingDaysMessage) {
        remainingDaysMessage.remove();
      }

      // Update the UI with the paid date
      const paidDate = localStorage.getItem(`paidDate_${index + 1}`);
      displayPaidDate(index + 1, paidDate);

      // Hide the "Paid" and "Edit" buttons
      const paidButton = submissionBox.querySelector('button:nth-of-type(1)'); // Assuming "Paid" is the first button
      const editButton = submissionBox.querySelector('button:nth-of-type(2)'); // Assuming "Edit" is the second button
      paidButton.style.display = 'none';
      editButton.style.display = 'none';
    }
  });
}




// Load existing submissions on page load
loadFromLocalStorage();









function createSubmissionBox(submission, count) {
  const newSubmissionDiv = document.createElement("div");
  newSubmissionDiv.className = "submissionBox";

  // Calculate remaining due days
  const currentDate = new Date();
  const dueDate = new Date(submission.dueDate);
  const remainingDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

  // Display remaining due days message at the top
  const remainingDaysMessage = document.createElement("p");
  remainingDaysMessage.className = "remainingDaysMessage";
  
  if (remainingDays < 0) {
      remainingDaysMessage.style.color = "red";
      remainingDaysMessage.style.fontSize = "1.5em"; // Set the font size for negative days
      remainingDaysMessage.textContent = `Overdue by ${Math.abs(remainingDays)} days`;
  } else if (remainingDays === 0) {
      remainingDaysMessage.style.color = "orange";
      remainingDaysMessage.style.fontSize = "1.5em"; // Set the font size for zero days
      remainingDaysMessage.textContent = "Due today";
  } else {
      remainingDaysMessage.style.color = "green";
      remainingDaysMessage.style.fontSize = "1.5em"; // Set the font size for positive days
      remainingDaysMessage.textContent = `Due in ${remainingDays} days`;
  }

  newSubmissionDiv.appendChild(remainingDaysMessage);

  newSubmissionDiv.innerHTML += `
      
      <p><strong>Name:</strong> ${submission.name}</p>
      <p><strong>Due Date:</strong> ${submission.dueDate}</p>
      <p><strong>Interest Money:</strong> ${submission.interestMoney}</p>
      <p><strong>Interest Duration:</strong> ${submission.interestDuration} months</p>
      <p><strong>Interest Month:</strong> ${submission.interestMonth} month</p>
      <div class="paidDateContainer"></div>
      <div class="buttonsContainer">
          <button onclick="markAsPaid(${count})">Paid</button>
          <button onclick="editSubmission(${count})">Edit</button>
          <button onclick="deleteSubmission(${count})">Delete</button>
          <button onclick="copySubmission(${count})">Copy</button>
      </div>
  `;

  return newSubmissionDiv;
}



// Function to submit the form
function submitForm(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var dueDate = document.getElementById("dueDate").value;
    var interestMoney = document.getElementById("interestMoney").value;
    var interestDuration = document.getElementById("interestDuration").value;
    var interestMonth = document.getElementById("interestMonth").value;

    var submittedDataContainer = document.getElementById("submittedDataContainer");

    // Create a new div for each submission
    var newSubmissionDiv = createSubmissionBox({
        name: name,
        dueDate: dueDate,
        interestMoney: interestMoney,
        interestDuration: interestDuration,
        interestMonth: interestMonth
    }, ++submissionCount);

    // Save submitted data to localStorage
    saveToLocalStorage({
        name: name,
        dueDate: dueDate,
        interestMoney: interestMoney,
        interestDuration: interestDuration,
        interestMonth: interestMonth
    });

    // Append the new div to the container
    submittedDataContainer.appendChild(newSubmissionDiv);

    // Clear the form fields after submission
    document.getElementById("loanForm").reset();
}



// Function to edit a submission
// Function to edit a submission
function editSubmission(count) {
  const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
  const originalContent = submissionBox.innerHTML;

  // Display a temporary message
  const editMessage = document.createElement("p");
  editMessage.textContent = "Currently this button is not working. If you want to change the data, delete it and create a new entry carefully.";
  editMessage.style.color = "red"; // Set the color to red
  submissionBox.appendChild(editMessage);

  // Set a timeout to remove the message after 6 seconds
  setTimeout(() => {
      editMessage.remove();
  }, 6000);
}










// Action when the "Copy" button is clicked
function copySubmission(count) {
    alert(`Copying submission #${count}.`);
}



// Function to display the paid date
function displayPaidDate(count, paidDate) {
    const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);

    // Create the "Paid Date" paragraph if it doesn't exist
    let paidDateParagraph = submissionBox.querySelector('.paidDateParagraph');
    if (!paidDateParagraph) {
        paidDateParagraph = document.createElement("p");
        paidDateParagraph.className = 'paidDateParagraph';
        submissionBox.appendChild(paidDateParagraph);
    }

    // Update the content of the "Paid Date" paragraph
    paidDateParagraph.innerHTML = `<strong>Paid Date:</strong> ${paidDate}`;
}

// Load existing submissions on page load
loadFromLocalStorage();


function searchData() {
  const searchInput = document.querySelector('.search-bar input');
  const searchTerm = searchInput.value.toLowerCase();

  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

  // Filter submissions based on the search term
  const filteredSubmissions = submissions.filter(submission => {
      const submissionValues = Object.values(submission).map(value => value.toString().toLowerCase());
      return submissionValues.some(value => value.includes(searchTerm));
  });

  // Display the filtered submissions
  const submittedDataContainer = document.getElementById("submittedDataContainer");
  submittedDataContainer.innerHTML = '';

  filteredSubmissions.forEach((submission, index) => {
      const newSubmissionDiv = createSubmissionBox(submission, index + 1);
      submittedDataContainer.appendChild(newSubmissionDiv);

      // Check if the submission is marked as paid
      const isPaid = localStorage.getItem(`isPaid_${index + 1}`);
      if (isPaid === "true") {
          // Remove the remaining days message
          const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${index + 1})`);
          const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
          if (remainingDaysMessage) {
              remainingDaysMessage.remove();
          }

          // Update the UI with the paid date
          const paidDate = localStorage.getItem(`paidDate_${index + 1}`);
          displayPaidDate(index + 1, paidDate);

          // Hide the "Paid" and "Edit" buttons
          const paidButton = submissionBox.querySelector('button:nth-of-type(1)'); // Assuming "Paid" is the first button
          const editButton = submissionBox.querySelector('button:nth-of-type(2)'); // Assuming "Edit" is the second button
          paidButton.style.display = 'none';
          editButton.style.display = 'none';
      }
  });
}


function copySubmission(count) {
  const submission = getSubmissionData(count);
  
  if (!submission) {
      alert("Submission data not found.");
      return;
  }

  let copyText;

  if (isSubmissionPaid(count)) {
      // After marking as paid
      copyText = generateCopyTextPaid(submission);
  } else {
      // Before marking as paid
      copyText = generateCopyTextNotPaid(submission);
  }

  copyToClipboard(copyText);
  alert("Text copied to clipboard!");
}

function isSubmissionPaid(count) {
  return localStorage.getItem(`isPaid_${count}`) === "true";
}

function getSubmissionData(count) {
  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
  return submissions[count - 1];
}



function generateCopyTextNotPaid(submission) {
  const remainingDays = calculateRemainingDays(submission.dueDate);

  // Function to calculate interest charges for each week
  const calculateInterest = (dueAmount, interestRate) => {
      const interest = dueAmount * (interestRate / 100);
      return (interest) // Fix to two decimal places
  };

  // Calculate interest charges for each week including the original due amount
  const week1Charge = calculateInterest(submission.interestMoney, 8);
  const week2Charge = calculateInterest(submission.interestMoney, 13);
  const week3Charge = calculateInterest(submission.interestMoney, 20);

  return `Hi *${submission.name}*!,

You have taken *${submission.interestDuration} installments*, and your *${submission.interestMonth} installment* is Rs *${submission.interestMoney}* due on *${submission.dueDate}*.

You have left *${remainingDays} days*.

Please pay on time to avoid *Extra Charges*.

*Charges*:
*1st* week: *8%* interest on *${submission.interestMoney}* was *${week1Charge}*
*2nd* week: *13%* interest on *${submission.interestMoney}* was *${week2Charge}*
From *3rd* week: *20%* interest on *${submission.interestMoney}* was *${week3Charge}*`;
}





function displayCopyMessage(submissionBox) {
  const copyMessage = document.createElement("p");
  copyMessage.textContent = "Text copied successfully!";
  copyMessage.style.color = "green"; // Set the color to green
  submissionBox.appendChild(copyMessage);

  // Set a timeout to remove the message after 3 seconds
  setTimeout(() => {
      copyMessage.remove();
  }, 3000);
}







function copySubmission(count) {
  const submission = getSubmissionData(count);

  if (!submission) {
    alert("Submission data not found.");
    return;
  }

  let copyText;

  if (isSubmissionPaid(count)) {
    copyText = generateCopyTextPaid(submission);
  } else {
    copyText = generateCopyTextNotPaid(submission);
  }

  copyToClipboard(copyText);

  const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
  displayCopyMessage(submissionBox);
}

function generateCopyTextPaid(submission) {
  const currentDate = new Date().toLocaleDateString();

  return `Hi *${submission.name}*!,

You have successfully paid your *${submission.interestMonth} installment* of *${submission.interestMoney}* on *${currentDate}*`;
}



function getPaidDate(count) {
  return localStorage.getItem(`paidDate_${count}`);
}

function calculateRemainingDays(dueDate) {
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);
  const remainingDays = Math.ceil((dueDateObj - currentDate) / (1000 * 60 * 60 * 24));
  return remainingDays;
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}


function updateCurrentDate() {
  const currentDateTimeElement = document.getElementById("currentDateTime");

  if (currentDateTimeElement) {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
         
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });

      currentDateTimeElement.textContent = formattedDate;
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", updateCurrentDate);

// Optionally, update the date every day (86400000 milliseconds)
setInterval(updateCurrentDate, 86400000);  // 24 hours
