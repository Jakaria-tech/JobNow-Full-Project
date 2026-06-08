// --- Database Storage Setup ---
if (!localStorage.getItem('jobnow_users')) {
    localStorage.setItem('jobnow_users', JSON.stringify([]));
}
if (!localStorage.getItem('jobnow_jobs')) {
    const demoJobs = [
        { id: 1, title: "Part-time Cashier for Supermarket", desc: "4 PM to 9 PM daily. Experience preferred. Location: Dhanmondi.", type: "Part-time", salary: "8,000 BDT / Month", recruiterEmail: "recruiter@demo.com" },
        { id: 2, title: "Delivery Rider Needed for Today", desc: "Need someone with a bicycle to deliver 5 packages around Dhanmondi today.", type: "Daily Basis", salary: "600 BDT / Day", recruiterEmail: "recruiter@demo.com" }
    ];
    localStorage.setItem('jobnow_jobs', JSON.stringify(demoJobs));
}
if (!localStorage.getItem('jobnow_applications')) {
    localStorage.setItem('jobnow_applications', JSON.stringify([]));
}

// --- Sign Up Management ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;
        const role = document.getElementById('regRole').value;

        const users = JSON.parse(localStorage.getItem('jobnow_users'));
        if (users.some(u => u.email === email)) {
            alert('This email is already registered!');
            return;
        }

        users.push({ 
            name, email, password, role, 
            appliedJobs: [], 
            cv: { phone: '', skills: '', education: '', experience: '' } 
        });
        localStorage.setItem('jobnow_users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// --- Login Management ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;

        const users = JSON.parse(localStorage.getItem('jobnow_users'));
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('jobnow_currentUser', JSON.stringify(user));
            alert('Welcome to JobNow Dashboard!');
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password!');
        }
    });
}

// --- Dashboard Logic Management ---
if (window.location.pathname.includes('dashboard.html')) {
    let currentUser = JSON.parse(localStorage.getItem('jobnow_currentUser'));

    if (!currentUser) { window.location.href = 'login.html'; }

    const syncUser = () => {
        const users = JSON.parse(localStorage.getItem('jobnow_users'));
        const match = users.find(u => u.email === currentUser.email);
        if (match) {
            currentUser = match;
            localStorage.setItem('jobnow_currentUser', JSON.stringify(currentUser));
        }
    };
    syncUser();
    let editingJobId = null;

    // UI Dashboard Base Setup
    document.getElementById('welcomeUser').innerText = `👋 ${currentUser.name}`;
    document.getElementById('profName').innerText = currentUser.name;
    document.getElementById('profEmail').innerText = currentUser.email;
    document.getElementById('profAvatar').innerText = currentUser.name.charAt(0).toUpperCase();

    if (currentUser.role === 'recruiter') {
        document.getElementById('profRole').innerText = 'Recruiter';
        document.getElementById('recruiterSection').style.display = 'block';
        document.getElementById('recruiterStats').style.display = 'block';
        document.getElementById('navNotifications').style.display = 'inline-block';
        
        const jobs = JSON.parse(localStorage.getItem('jobnow_jobs'));
        document.getElementById('postedCount').innerText = jobs.filter(j => j.recruiterEmail === currentUser.email).length;
    } else {
        document.getElementById('profRole').innerText = 'Job Seeker';
        document.getElementById('jobseekerSection').style.display = 'block';
        document.getElementById('seekerStats').style.display = 'block';
        document.getElementById('appliedCount').innerText = currentUser.appliedJobs ? currentUser.appliedJobs.length : 0;
        document.getElementById('profileSkills').innerText = currentUser.cv?.skills || 'None Set';

        if(currentUser.cv) {
            document.getElementById('cvPhone').value = currentUser.cv.phone || '';
            document.getElementById('cvSkills').value = currentUser.cv.skills || '';
            document.getElementById('cvEdu').value = currentUser.cv.education || '';
            document.getElementById('cvExp').value = currentUser.cv.experience || '';
            
            document.getElementById('printCvName').innerText = currentUser.name;
            document.getElementById('printCvEmail').innerText = currentUser.email;
            document.getElementById('printCvPhone').innerText = currentUser.cv.phone || 'None';
            document.getElementById('printCvSkills').innerText = currentUser.cv.skills || 'None';
            document.getElementById('printCvEdu').innerText = currentUser.cv.education || 'No Education Data Added Yet.';
            document.getElementById('printCvExp').innerText = currentUser.cv.experience || 'No Experience Data Added Yet.';
        }
    }

    // Render Jobs List
const renderJobs = () => {
    const jobs = JSON.parse(localStorage.getItem('jobnow_jobs'));
    const jobListDiv = document.getElementById('jobList');

    const filterElement = document.getElementById('jobFilter');
    const selectedFilter = filterElement ? filterElement.value : 'All';

    jobListDiv.innerHTML = '';

    let filteredJobs = jobs;

    if (selectedFilter !== 'All') {
        filteredJobs = jobs.filter(job => job.type === selectedFilter);
    }

    if (filteredJobs.length === 0) {
        jobListDiv.innerHTML = `
            <div class="job-card">
                <h4>No Jobs Found</h4>
                <p>No jobs available in this category.</p>
            </div>
        `;
        return;
    }

    filteredJobs.forEach(job => {
        const badgeClass = job.type === 'Part-time' ? 'part-time' : 'daily';
        let actionButton = '';

        if (currentUser.role === 'jobseeker') {
            const hasApplied = currentUser.appliedJobs &&
                currentUser.appliedJobs.includes(job.id);

            actionButton = hasApplied
                ? `<button style="background-color:#64748b; cursor:not-allowed;" disabled>Applied</button>`
                : `<button onclick="applyJob(${job.id}, '${job.title}', '${job.recruiterEmail}')">Apply Now</button>`;
        } else {
            if (job.recruiterEmail === currentUser.email) {
    actionButton = `
        <button onclick="editJob(${job.id})"
            style="background:#f59e0b; width:auto; margin-right:5px;">
            Edit
        </button>

        <button onclick="deleteJob(${job.id})"
            style="background:#ef4444; width:auto;">
            Delete
        </button>
    `;
} else {
    actionButton = `
        <span style="color:#64748b; font-size:14px; font-style:italic; font-weight:600;">
            Active Post
        </span>
    `;
}
        }

        jobListDiv.innerHTML += `
            <div class="job-card">
                <span class="badge ${badgeClass}">${job.type}</span>
                <h4>${job.title}</h4>
                <p style="color:#475569; font-size:15px; margin:8px 0;">${job.desc}</p>
                <p class="salary">Salary: ${job.salary}</p>
                ${actionButton}
            </div>
        `;
    });
};
    // Render Recruiter Alerts
    const renderRecruiterAlerts = () => {
        if(currentUser.role !== 'recruiter') return;
        const apps = JSON.parse(localStorage.getItem('jobnow_applications')) || [];
        const myJobApps = apps.filter(a => a.recruiterEmail === currentUser.email);
        
        document.getElementById('notiCount').innerText = myJobApps.length;
        const alertsList = document.getElementById('applicantAlertsList');
        alertsList.innerHTML = '';

        if(myJobApps.length === 0) {
            alertsList.innerHTML = '<p style="color:#64748b; font-size:14px;">No applications received yet.</p>';
            return;
        }

        myJobApps.forEach(app => {
            alertsList.innerHTML += `
<div class="applicant-card">

    <p style="font-size:14px; color:#1e293b;">
        🔔 <strong>${app.applicantName}</strong>
        applied for
        <strong>"${app.jobTitle}"</strong>
    </p>

    <div style="
        background:white;
        border:1px solid #e2e8f0;
        padding:10px;
        border-radius:6px;
        margin:10px 0;
        font-size:13px;
    ">

        <p><strong>Name:</strong> ${app.applicantName}</p>

        <p><strong>Email:</strong> ${app.applicantEmail}</p>

        <p><strong>Phone:</strong>
        ${app.applicantCv.phone || 'Not Provided'}</p>

        <p><strong>Education:</strong>
        ${app.applicantCv.education || 'Not Provided'}</p>

        <p><strong>Skills:</strong>
        ${app.applicantCv.skills || 'Not Provided'}</p>

        <p><strong>Experience:</strong>
        ${app.applicantCv.experience || 'Not Provided'}</p>

        <p><strong>Applied On:</strong>
        ${app.appliedAt || 'N/A'}</p>

        <p><strong>Status:</strong>
        ${app.status || 'Pending'}</p>

    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;">

        <a href="tel:${app.applicantCv.phone}">
            <button style="
                width:auto;
                padding:5px 15px;
                font-size:12px;
                background-color:#10b981;
            ">
                📞 Call Candidate
            </button>
        </a>

        <a href="mailto:${app.applicantEmail}">
            <button style="
                width:auto;
                padding:5px 15px;
                font-size:12px;
                background-color:#3b82f6;
            ">
                📧 Email Candidate
            </button>
        </a>

    </div>

</div>
`;
        });
    };

    // Recruiter Post Job Code
    const jobPostForm = document.getElementById('jobPostForm');
    if (jobPostForm) {
        jobPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const jobs = JSON.parse(localStorage.getItem('jobnow_jobs'));
            if (editingJobId !== null) {

    const jobIndex = jobs.findIndex(
        job => job.id === editingJobId
    );

    if (jobIndex !== -1) {

        jobs[jobIndex].title =
            document.getElementById('jobTitle').value;

        jobs[jobIndex].desc =
            document.getElementById('jobDesc').value;

        jobs[jobIndex].type =
            document.getElementById('jobType').value;

        jobs[jobIndex].salary =
            document.getElementById('jobSalary').value;
    }

    editingJobId = null;

    alert('Job updated successfully!');

} else {

    jobs.unshift({
        id: Date.now(),
        title: document.getElementById('jobTitle').value,
        desc: document.getElementById('jobDesc').value,
        type: document.getElementById('jobType').value,
        salary: document.getElementById('jobSalary').value,
        recruiterEmail: currentUser.email
    });

    alert('Your instant job has been listed live!');
}

localStorage.setItem('jobnow_jobs', JSON.stringify(jobs));

jobPostForm.reset();

document.getElementById('postedCount').innerText =
    jobs.filter(
        j => j.recruiterEmail === currentUser.email
    ).length;

renderJobs();
            localStorage.setItem('jobnow_jobs', JSON.stringify(jobs));
            
            alert('Your instant job has been listed live!');
            jobPostForm.reset();
            document.getElementById('postedCount').innerText = jobs.filter(j => j.recruiterEmail === currentUser.email).length;
            renderJobs();
        });
    }

    // Save Seeker CV
    const cvForm = document.getElementById('cvForm');
    if (cvForm) {
        cvForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('jobnow_users'));
            const userIdx = users.findIndex(u => u.email === currentUser.email);

            if(userIdx !== -1) {
                users[userIdx].cv = {
                    phone: document.getElementById('cvPhone').value,
                    skills: document.getElementById('cvSkills').value,
                    education: document.getElementById('cvEdu').value,
                    experience: document.getElementById('cvExp').value
                };
                localStorage.setItem('jobnow_users', JSON.stringify(users));
                alert('Your Professional Profile / CV Saved & Synchronized!');
                location.reload();
            }
        });
    }

    // Apply For Jobs
    window.applyJob = (jobId, jobTitle, recruiterEmail) => {
        if(!currentUser.cv || !currentUser.cv.phone) {
            alert('Please fill out and save your CV Form below before applying!');
            return;
        }

        const users = JSON.parse(localStorage.getItem('jobnow_users'));
        const userIdx = users.findIndex(u => u.email === currentUser.email);

        if (userIdx !== -1) {
            if (!users[userIdx].appliedJobs) users[userIdx].appliedJobs = [];
            if (
    users[userIdx].appliedJobs &&
    users[userIdx].appliedJobs.includes(jobId)
) {
    alert('You already applied for this job!');
    return;
}

users[userIdx].appliedJobs.push(jobId)
            localStorage.setItem('jobnow_users', JSON.stringify(users));

            const apps = JSON.parse(localStorage.getItem('jobnow_applications')) || [];
           apps.push({
    id: Date.now(),
    jobId,
    jobTitle,
    recruiterEmail,

    applicantEmail: currentUser.email,
    applicantName: currentUser.name,

    applicantCv: {
        phone: currentUser.cv.phone,
        skills: currentUser.cv.skills,
        education: currentUser.cv.education,
        experience: currentUser.cv.experience
    },

    appliedAt: new Date().toLocaleString(),
    status: "Pending"
});
            localStorage.setItem('jobnow_applications', JSON.stringify(apps));

            alert(`Successfully applied for "${jobTitle}". Recruiter notified!`);
            location.reload();
        }
    }

    // Course Enrollment Code
    window.enrollCourse = (courseName) => {
        const users = JSON.parse(localStorage.getItem('jobnow_users'));
        const userIdx = users.findIndex(u => u.email === currentUser.email);

        if(userIdx !== -1) {
            let currentSkills = users[userIdx].cv.skills ? users[userIdx].cv.skills.split(',') : [];
            currentSkills = currentSkills.map(s => s.trim()).filter(s => s !== '');
            
            if(!currentSkills.includes(courseName)) {
                currentSkills.push(courseName);
                users[userIdx].cv.skills = currentSkills.join(', ');
                localStorage.setItem('jobnow_users', JSON.stringify(users));
                alert(`Congratulations! You passed the "${courseName}" test. Added to your profile!`);
                location.reload();
            } else {
                alert(`You have already completed the ${courseName} test!`);
            }
        }
    };
    

    // Logout Code
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('jobnow_currentUser');
        window.location.href = 'login.html';
    });const jobFilter = document.getElementById('jobFilter');
if (jobFilter) {
    jobFilter.addEventListener('change', renderJobs);
}
    renderJobs();
    renderRecruiterAlerts();
    // --- Filter Buttons Fix ---
window.filterJobs = () => {
    renderJobs();
};

window.resetJobFilter = () => {
    const filterElement = document.getElementById('jobFilter');
    if (filterElement) {
        filterElement.value = 'All';
        renderJobs();
    }
};
}