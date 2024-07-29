function getUriWithoutDashboard() {
    const reg = new RegExp('(\\/dashboard.*$|\\/$|\\?.*$)');
    let baseUri = location.href;

    if (baseUri.match(reg)!= null) {
        baseUri = baseUri.replace(reg, '');
    }

    return baseUri;
}

function getUriWithDashboard() {
    const baseUri = getUriWithoutDashboard();
    return `${baseUri}/dashboard`;
}

function goToIssue(id) { 
    const baseUri = getUriWithoutDashboard();
    location.href = `${baseUri}/issues/${id}`;
}

function chooseProject(projectId) {
    trackerId = document.querySelector('#select_tracker').value;
    if (typeof trackerId !== 'undefined' && trackerId !== null && trackerId !== '') {
        chooseProject4Tracker(projectId,trackerId);
    }
     else {
        location.search = `project_id=${projectId}`;   
    }
}
function chooseTracker(trackerId) {
    projectId = document.querySelector('#select_project').value;
    if (typeof projectId !== 'undefined' && projectId !== null && projectId !== '') {
        chooseProject4Tracker(projectId,trackerId);
    }
    else{
        location.search = `tracker_id=${trackerId}`;     
    }

}

function chooseProject4Tracker(projectId,trackerId) {
    if (projectId == "-1" &&  trackerId == "-1") {
        location.search = "";
    }        
    if (projectId == "-1" && trackerId != "-1") {
        location.search = `tracker_id=${trackerId}`; 
    } 
    if (projectId != "-1" && trackerId == "-1"){
        location.search = `project_id=${projectId}`;
    } 
    if (projectId != "-1" && trackerId != "-1"){
        location.search =  `project_id=${projectId}&&tracker_id=${trackerId}`;      
    }
}


async function setIssueStatus(issueId, statusId, item, oldContainer, oldIndex) { 
    const response = await fetch(`${getUriWithDashboard()}/set_issue_status/${issueId}/${statusId}`);
    if (!response.ok) {
        oldContainer.insertBefore(item, oldContainer.childNodes[oldIndex + 1]);
    }
}

function init(useDragAndDrop) {
    document.querySelector('#main-menu').remove();

    document.querySelectorAll('.select_project_item').forEach(item => {
        item.addEventListener('click', function() {
            chooseProject(this.dataset.id);
        })
    });

    const projectsSelector = document.querySelector('#select_project');
    if (projectsSelector != null) {
        projectsSelector.addEventListener('change', function(e) {
            chooseProject(this.value);
        });
    }


    document.querySelectorAll('.select_tracker_item').forEach(item => {
        item.addEventListener('click', function() {
            chooseTracker(this.dataset.id);
        })
    });

    const trackersSelector = document.querySelector('#select_tracker');
    if (trackersSelector != null) { 
        trackersSelector.addEventListener('change', function(e) {
            chooseTracker(this.value);
        });
    }


    document.querySelector("#content").style.overflow = "hidden"; 

    if (useDragAndDrop) {
        document.querySelectorAll('.status_column_closed_issues, .status_column_issues').forEach(item => {
            new Sortable(item, {
                group: 'issues',
                animation: 150,
                draggable: '.issue_card',
                onEnd: async function(evt) {
                    const newStatus = evt.to.closest('.status_column').dataset.id;
                    const issueId = evt.item.dataset.id;
    
                    await setIssueStatus(issueId, newStatus, evt.item, evt.from, evt.oldIndex);
                }
            })
        })
    }
}