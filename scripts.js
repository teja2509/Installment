let submissionCount = 0; 

function saveToLocalStorage(data) {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.push(data);
    localStorage.setItem('submissions', JSON.stringify(submissions));
}

function markAsPaid(count) {
  const paidKey = `paidDate_${count}`;
  const isPaidKey = `isPaid_${count}`;
  if (localStorage.getItem(isPaidKey)) {
    return;
  }
  const currentDate = new Date().toLocaleDateString();
  localStorage.setItem(paidKey, currentDate);
  localStorage.setItem(isPaidKey, "true");
  const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
  const paidDateParagraph = document.createElement("p");
  paidDateParagraph.innerHTML = `<strong>Paid Date:</strong> ${currentDate}`;
  const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
  if (remainingDaysMessage) {
    remainingDaysMessage.remove();
  }
  const existingPaidDateParagraph = submissionBox.querySelector('.paidDateParagraph');
  if (existingPaidDateParagraph) {
    existingPaidDateParagraph.innerHTML = paidDateParagraph.innerHTML;
  } else {
    submissionBox.insertBefore(paidDateParagraph, submissionBox.querySelector('.buttonsContainer'));
  }
  const paidButton = submissionBox.querySelector('button:nth-of-type(1)');
  const editButton = submissionBox.querySelector('button:nth-of-type(2)'); 
  paidButton.style.display = 'none';
  editButton.style.display = 'none';
  const paidSuccessfullyMessage = document.createElement("p");
  paidSuccessfullyMessage.textContent = "Paid Successfully!";
  paidSuccessfullyMessage.style.color = "green"; 
  submissionBox.appendChild(paidSuccessfullyMessage);
  setTimeout(() => {
    paidSuccessfullyMessage.remove();
  }, 3000);
}

function deleteSubmission(count) {
  const isConfirmed = window.confirm("Are you sure you want to delete this submission?");
  if (isConfirmed) {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    submissions.splice(count - 1, 1); 
    localStorage.setItem('submissions', JSON.stringify(submissions));
    localStorage.removeItem(`paidDate_${count}`);
    localStorage.removeItem(`isPaid_${count}`);
    const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
    const deleteMessage = document.createElement("p");
    deleteMessage.textContent = "Data deleted successfully.";
    deleteMessage.style.color = "red"; 
    submissionBox.appendChild(deleteMessage);
    setTimeout(() => {
      deleteMessage.remove();
      submissionBox.remove();
    }, 3000);
  } else {
    const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
    const cancelMessage = document.createElement("p");
    cancelMessage.textContent = "Data was not deleted.";
    cancelMessage.style.color = "green"; 
    submissionBox.appendChild(cancelMessage);
    setTimeout(() => {
      cancelMessage.remove();
    }, 3000);
  }
}

function loadFromLocalStorage() {
  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
  const submittedDataContainer = document.getElementById("submittedDataContainer");
  submittedDataContainer.innerHTML = '';
  submissions.forEach((submission, index) => {
    const newSubmissionDiv = createSubmissionBox(submission, index + 1);
    submittedDataContainer.appendChild(newSubmissionDiv);
    const isPaid = localStorage.getItem(`isPaid_${index + 1}`);
    if (isPaid === "true") {
      const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${index + 1})`);
      const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
      if (remainingDaysMessage) {
        remainingDaysMessage.remove();
      }
      const paidDate = localStorage.getItem(`paidDate_${index + 1}`);
      displayPaidDate(index + 1, paidDate);
      const paidButton = submissionBox.querySelector('button:nth-of-type(1)');
      const editButton = submissionBox.querySelector('button:nth-of-type(2)'); 
      paidButton.style.display = 'none';
      editButton.style.display = 'none';
    }
  });
}

loadFromLocalStorage();


function createSubmissionBox(submission, count) {
  const newSubmissionDiv = document.createElement("div");
  newSubmissionDiv.className = "submissionBox";
  const currentDate = new Date();
  const dueDate = new Date(submission.dueDate);
  const remainingDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
  const remainingDaysMessage = document.createElement("p");
  remainingDaysMessage.className = "remainingDaysMessage";
  if (remainingDays < 0) {
      remainingDaysMessage.style.color = "red";
      remainingDaysMessage.style.fontSize = "1.5em"; 
      remainingDaysMessage.textContent = `Overdue by ${Math.abs(remainingDays)} days`;
  } else if (remainingDays === 0) {
      remainingDaysMessage.style.color = "orange";
      remainingDaysMessage.style.fontSize = "1.5em"; 
      remainingDaysMessage.textContent = "Due today";
  } else {
      remainingDaysMessage.style.color = "green";
      remainingDaysMessage.style.fontSize = "1.5em"; 
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


function submitForm(event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var dueDate = document.getElementById("dueDate").value;
    var interestMoney = document.getElementById("interestMoney").value;
    var interestDuration = document.getElementById("interestDuration").value;
    var interestMonth = document.getElementById("interestMonth").value;
    var submittedDataContainer = document.getElementById("submittedDataContainer");
    var newSubmissionDiv = createSubmissionBox({
        name: name,
        dueDate: dueDate,
        interestMoney: interestMoney,
        interestDuration: interestDuration,
        interestMonth: interestMonth
    }, ++submissionCount);
    saveToLocalStorage({
        name: name,
        dueDate: dueDate,
        interestMoney: interestMoney,
        interestDuration: interestDuration,
        interestMonth: interestMonth
    });
    submittedDataContainer.appendChild(newSubmissionDiv);
    document.getElementById("loanForm").reset();
}

function editSubmission(count) {
  const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
  const originalContent = submissionBox.innerHTML;
  const editMessage = document.createElement("p");
  editMessage.textContent = "Currently this button is not working. If you want to change the data, delete it and create a new entry carefully.";
  editMessage.style.color = "red";
  submissionBox.appendChild(editMessage);
  setTimeout(() => {
      editMessage.remove();
  }, 6000);
}

function copySubmission(count) {
    alert(`Copying submission #${count}.`);
}

function displayPaidDate(count, paidDate) 
{
    const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${count})`);
    let paidDateParagraph = submissionBox.querySelector('.paidDateParagraph');
    if (!paidDateParagraph) {
        paidDateParagraph = document.createElement("p");
        paidDateParagraph.className = 'paidDateParagraph';
        submissionBox.appendChild(paidDateParagraph);
    paidDateParagraph.innerHTML = `<strong>Paid Date:</strong> ${paidDate}`;
}
}
loadFromLocalStorage();

function searchData() {
  const searchInput = document.querySelector('.search-bar input');
  const searchTerm = searchInput.value.toLowerCase();
  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
  const filteredSubmissions = submissions.filter(submission => {
      const submissionValues = Object.values(submission).map(value => value.toString().toLowerCase());
      return submissionValues.some(value => value.includes(searchTerm));
  });
  const submittedDataContainer = document.getElementById("submittedDataContainer");
  submittedDataContainer.innerHTML = '';
  filteredSubmissions.forEach((submission, index) => {
      const newSubmissionDiv = createSubmissionBox(submission, index + 1);
      submittedDataContainer.appendChild(newSubmissionDiv);
      const isPaid = localStorage.getItem(`isPaid_${index + 1}`);
      if (isPaid === "true") {
          const submissionBox = document.querySelector(`#submittedDataContainer .submissionBox:nth-child(${index + 1})`);
          const remainingDaysMessage = submissionBox.querySelector('.remainingDaysMessage');
          if (remainingDaysMessage) {
              remainingDaysMessage.remove();
          }
          const paidDate = localStorage.getItem(`paidDate_${index + 1}`);
          displayPaidDate(index + 1, paidDate);
          const paidButton = submissionBox.querySelector('button:nth-of-type(1)');
          const editButton = submissionBox.querySelector('button:nth-of-type(2)'); 
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
      copyText = generateCopyTextPaid(submission);
  } else {
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
  const calculateInterest = (dueAmount, interestRate) => {
      const interest = dueAmount * (interestRate / 100);
      return (interest) 
  };
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
  copyMessage.style.color = "green"; 
  submissionBox.appendChild(copyMessage);
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

document.addEventListener("DOMContentLoaded", updateCurrentDate);

setInterval(updateCurrentDate, 86400000);  // 24 hours
