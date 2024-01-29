
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

  // Set a timeout to remove the message and reload the page after 3 seconds
  setTimeout(() => {
    paidSuccessfullyMessage.remove();
    location.reload(); // Reload the page
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

    // Set a timeout to remove the message and reload the page after 3 seconds
    setTimeout(() => {
      deleteMessage.remove();
      submissionBox.remove();
      location.reload(); // Reload the page
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
          <button class="paid" onclick="markAsPaid(${count})">Paid</button>
          

          <button class="Btn" onclick="editSubmission(${count})">Edit 
            <svg class="svg" viewBox="0 0 512 512">
            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
          </button>
    
    
          <button class="bin-button" onclick="deleteSubmission(${count})">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 39 7"
              class="bin-top"
            >
              <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
              <line
                stroke-width="3"
                stroke="white"
                y2="1.5"
                x2="26.0357"
                y1="1.5"
                x1="12"
              ></line>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 33 39"
              class="bin-bottom"
            >
              <mask fill="white" id="path-1-inside-1_8_19">
                <path
                  d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                ></path>
              </mask>
              <path
                mask="url(#path-1-inside-1_8_19)"
                fill="white"
                d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
              ></path>
              <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
              <path stroke-width="4" stroke="white" d="M21 6V29"></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 89 80"
              class="garbage"
            >
              <path
                fill="white"
                d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
              ></path>
            </svg>
          </button>

          
          <button class="copy" onclick="copySubmission(${count})">
          
              <svg viewBox="0 0 512 512" class="svgIcon" height="1em"><path d="M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"></path></svg>
              <p class="text">COPY</p>
              <span class="effect"></span>
          </button>

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

  // Reload the page
  location.reload();
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
  const searchInput = document.querySelector('.search input');
  const searchTerm = searchInput.value.toLowerCase();

  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

  // Filter submissions based on the search term
  const filteredSubmissions = submissions.filter(submission => {
    const submissionValues = Object.values(submission).map(value => value.toString().toLowerCase());
    return submissionValues.some(value => value.includes(searchTerm));
  });

  // Display the matching submissions first
  const matchingSubmissionsContainer = document.getElementById("submittedDataContainer");
  matchingSubmissionsContainer.innerHTML = '';

  filteredSubmissions.forEach((submission, index) => {
    const newSubmissionDiv = createSubmissionBox(submission, index + 1);
    matchingSubmissionsContainer.appendChild(newSubmissionDiv);

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

  // Display the remaining submissions
  const remainingSubmissions = submissions.filter(submission => !filteredSubmissions.includes(submission));
  const remainingSubmissionsContainer = document.getElementById("remainingSubmissionsContainer");

  remainingSubmissions.forEach((submission, index) => {
    const newSubmissionDiv = createSubmissionBox(submission, index + 1 + filteredSubmissions.length);
    remainingSubmissionsContainer.appendChild(newSubmissionDiv);

    // Check if the submission is marked as paid
    const isPaid = localStorage.getItem(`isPaid_${index + 1 + filteredSubmissions.length}`);
    if (isPaid === "true") {
      // Remove the remaining days message
      const submissionBox = document.querySelector(`#remainingSubmissionsContainer .submissionBox:nth-child(${index + 1 + filteredSubmissions.length})`);
      const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
      if (remainingDaysMessage) {
        remainingDaysMessage.remove();
      }

      // Update the UI with the paid date
      const paidDate = localStorage.getItem(`paidDate_${index + 1 + filteredSubmissions.length}`);
      displayPaidDate(index + 1 + filteredSubmissions.length, paidDate);

      // Hide the "Paid" and "Edit" buttons
      const paidButton = submissionBox.querySelector('button:nth-of-type(1)'); // Assuming "Paid" is the first button
      const editButton = submissionBox.querySelector('button:nth-of-type(2)'); // Assuming "Edit" is the second button
      paidButton.style.display = 'none';
      editButton.style.display = 'none';
    }
  });
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

  return `
  Dear *${submission.name}*,
  
  Greetings! We hope this message finds you well.
  
  We'd like to remind you about your installment plan, consisting of *${submission.interestDuration} installments*. Your upcoming *${submission.interestMonth} installment* is due on *${submission.dueDate}*. As of now, you have *${remainingDays} days* left to make the payment.
  
  *Loan Details:*
  *Installment Amount*: Rs. *${submission.interestMoney}*
  
  To ensure a smooth and hassle-free experience, we recommend making the payment on or before the due date. Failure to do so may result in additional charges.
  
  *Additional Charges Overview:*

  *1st Week:* 8% interest on the principal amount of Rs. *${submission.interestMoney}* amounts to an extra charge of Rs. *${week1Charge}*.
  
  *2nd Week:* 13% interest on the principal amount of Rs. *${submission.interestMoney}* results in an extra charge of Rs. *${week2Charge}*.
  
  *From 3rd Week:* 20% interest on the principal amount of Rs. *${submission.interestMoney}* incurs an extra charge of Rs. *${week3Charge}*.
  
  
  Thank you for choosing our services. Should you have any inquiries or require assistance, feel free to reach out.
  
  `;
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

  return `
  Hello *${submission.name}*,
  
  Great news! We wanted to inform you that your payment for the *${submission.interestMonth} installment* of Rs. *${submission.interestMoney}* has been successfully received.
  
  *Payment Details:*
  *Installment Amount:* Rs. *${submission.interestMoney}*
  *Paid Date:* *${submission.paidDate || currentDate}*
  
  We appreciate your prompt payment, which helps keep your account in good standing. Your commitment to timely payments is instrumental in ensuring a smooth and hassle-free experience.
  
  Thank you for your continued trust in our services. If you have any questions or need assistance, feel free to reach out.
  
  `;
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

function clearLocalStorage() {
  localStorage.clear();
  alert("Local storage cleared!");


}






