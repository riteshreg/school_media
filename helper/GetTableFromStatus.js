export default function GetTableFromStatus(status){
    switch(status){
        case '9': return 'project_submission_class_9'
        case '10': return 'project_submission_class_10'
        case '11': return 'fileSharing'
        case '12': return 'project_submission_class_12'
    }
}