export default function GetTableFromStatus(status){
    switch(status){
        case '9': return 'notes_class9'
        case '10': return 'notes_class10'
        case '11': return 'fileSharing'
        case '12': return 'notes_class12'
    }
}

export const GetTableNameForFileSubmission = (status) =>{
    switch(status){
        case '9': return 'file_submission_class9'
        case '10': return 'file_submission_class10'
        case '11': return 'file_submission_class11'
        case '12': return 'file_submission_class12'
    }
}