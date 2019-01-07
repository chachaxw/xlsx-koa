import XLSX from 'xlsx';

process.on('message', (m, data) => {
    switch(m) {
    case 'get data': 
        getData(data);
        break;
    }
});

/* helper to generate the workbook object */
function makeBook(data) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    return wb;
}

function getData(file) {
    const wb = XLSX.readFile(file);

}
