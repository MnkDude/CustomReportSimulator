let repListSelectedIndex = 0;
function makeRequest() {
    repListSelectedIndex=document.getElementById("repList")[document.getElementById("repList").selectedIndex];
    getSubcategDataTableData(repListSelectedIndex.id);
}

//Initial start
getCategoryList();
function getCategoryList() {
    for (let index = 1; index <= 4; index++) {
        var GetCategoryList = new XMLHttpRequest();
        GetCategoryList.open("GET", "../../CustomReportSettings.do?methodToCall=getCategoryList&req=%7B%22moduleID%22%3A%22" + index + "%22%7D", true);
        GetCategoryList.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        GetCategoryList.send();
        GetCategoryList.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var responseFormData = JSON.parse(this.responseText);
                var categoryDataList = responseFormData.categData;
                var selectList = document.getElementById("repList");
                for (var i = categoryDataList.length - 1; i >= 0; i--) {
                    var option = document.createElement('option');
                    option.text = option.value = categoryDataList[i].value;
                    option.id = categoryDataList[i].id;
                    selectList.add(option, 0);
                }
                selectList.selectedIndex = 0;
            }
        };
    }
}

let i = 0;
let tableDataListArray = [];
let customGroupNameID = -1;

// retrieving reportID, reportnames using module ID
function getSubcategDataTableData(categID) {
    var GetSubcategDataTableData = new XMLHttpRequest();
    var req = "%7B%22inputParams%22%3A%7B%22tableInputParams%22%3A%7B%22hideTableBottomOptions%22%3Atrue%2C%22sortColumn%22%3A%22UEBA_REPORT_NAME%22%2C%22hideTopDivider%22%3Atrue%2C%22rangeList%22%3A%5B%7B%22value%22%3A25%7D%2C%7B%22value%22%3A50%7D%2C%7B%22value%22%3A75%7D%2C%7B%22value%22%3A100%7D%5D%2C%22showSearchMethod%22%3A%22searchAction%22%2C%22showSearch%22%3Atrue%2C%22sortOrder%22%3A%22ASC%22%2C%22startValue%22%3A1%2C%22rangeValue%22%3A100%2C%22totalCount%22%3A7%2C%22searchData%22%3A%7B%7D%2C%22selectedCategID%22%3A2%7D%2C%22selectedCategID%22%3A%22" + categID + "%22%7D%7D";
    GetSubcategDataTableData.open("GET", "../../CustomReportSettings.do?methodToCall=getSubcategDataTableData&req=" + req, true);
    GetSubcategDataTableData.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    GetSubcategDataTableData.send();
    GetSubcategDataTableData.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            responseData = JSON.parse(this.responseText);
            tableDataListArray = responseData.tableDataList;
            getSubCategDataFromReport();
        }
    }
}

// retrieving report detail (Userview and/or HostView, actions) for reportID
function getSubCategDataFromReport() {
    let reportID = tableDataListArray[i].rowId;
    let reportName = tableDataListArray[i].columnValues[1].columnValue;
    let reportGroup = tableDataListArray[i].columnValues[2].columnValue;
    const GetSubCategDataRequest = new XMLHttpRequest();
    GetSubCategDataRequest.open("GET", "../../CustomReportSettings.do?methodToCall=getSubCategDataFromReport&req=%7B%22reportID%22%3A" + reportID + "%7D", true);   // %7B%22reportID%22%3A48%7D
    GetSubCategDataRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    GetSubCategDataRequest.send();
    GetSubCategDataRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const repList = document.getElementById("repList");
            let subCategoryListArray = [];
            let columnList = [];
            let myArr = JSON.parse(this.responseText);
            let patternData = myArr.patternArray;
            let patternPresent = myArr.patternPresent;
            for (let index = 0; index < myArr.subCategoryData.dropdownList.length; index++) {
                subCategoryListArray.push(myArr.subCategoryData.dropdownList[index].id);
            }
            for (let iindex = 0; iindex < myArr.columnTypeData.dropdownList.length; iindex++) {
                columnList.push(myArr.columnTypeData.dropdownList[iindex].id);
            }
            i++;
            let patternViewObject = {};
            if (patternPresent) {
                patternViewObject = makePatternView(patternData, reportID);
            }
            // retrievePatternFields(reportID, reportName, reportGroup, patternData, patternPresent);
            saveCustomReport(subCategoryListArray, JSON.stringify(columnList), reportID, reportName, reportGroup, patternViewObject, patternPresent);
        }
    };
}
let nodeObject = {};

// saving customreport with all views by retrieving customgroupname ID
function saveCustomReport(subCategoryListArray, columnList, reportID, reportName, reportGroup, patternViewObject, patternPresent) {
    var SaveCustomReportRequest = new XMLHttpRequest();
    console.log("saveCustomReport i" + i);
    console.log("saveCustomReport customGroupNameID" + customGroupNameID);
    SaveCustomReportRequest.open("POST", "../../CustomReportSettings.do?methodToCall=saveCustomReport", true);
    SaveCustomReportRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(customGroupNameID);
    console.log("subCategoryData" + JSON.stringify(subCategoryListArray));
    var params = "{\"reportName\":\"" + Date.now() + reportName + "\",\"addGroupName\":\"3" +
        repList.options[repList.selectedIndex].innerHTML + "\",\"GroupNameId\":" + customGroupNameID +
        ",\"description\":\"" + reportGroup + "\",\"viewsData\":\"\
%5B%7B%5C%22viewId%5C%22%3A1%2C%5C%22viewName%5C%22%3A%5C%22time_15m%5C%22%2C%5C%22columnList%5C%22%3A\
" + columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22\
%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A2%2C%5C%22viewName%5C%22%3A%5C%22time_30m%5C%22%2C%5C%22columnList\
%5C%22%3A" + columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A1%2C%5C%22seasonality\
%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A4%2C%5C%22viewName%5C%22%3A%5C%22time_1hr%5C%22%2C%5C%22\
columnList%5C%22%3A" + columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A2%2C%5C%22\
seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A6%2C%5C%22viewName%5C%22%3A%5C%22time_2hr%5C\
%22%2C%5C%22columnList%5C%22%3A" + columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C\
%22%3A3%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A8%2C%5C%22viewName%5C%22%3A%5C%22\
count_1hr%5C%22%2C%5C%22columnList%5C%22%3A" + columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22\
frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A10%2C%5C%22viewName\
%5C%22%3A%5C%22count_6hr%5C%22%2C%5C%22columnList%5C%22%3A" + columnList + "%2C%5C%22anomalyType\
%5C%22%3A1%2C%5C%22frequency%5C%22%3A1%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C\
%22%3A12%2C%5C%22viewName%5C%22%3A%5C%22count_12hr%5C%22%2C%5C%22columnList%5C%22%3A" + columnList + "\
%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A2%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B\
%5C%22viewId%5C%22%3A14%2C%5C%22viewName%5C%22%3A%5C%22count_24hr%5C%22%2C%5C%22columnList%5C%22%3A\
" + columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A3%2C%5C%22seasonality%5C\
%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A16%2C%5C%22viewName%5C%22%3A%5C%22seas%5C%22%2C%5C%22columnList\
%5C%22%3A" + columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality\
%5C%22%3Atrue%7D";
    if (patternPresent) {
        params = params + "%2C" + JSON.stringify(patternViewObject).replace(/"/g, "\\\"");
    }
    params = params + "%5D\",\"selectedReportID\":" + reportID + ",\"subCategoryList\":" + JSON.stringify(subCategoryListArray) + ",\"filterList\":[]}";
    params = "req=" + params + "&";
    var uebacsrf = document.cookie.split('uebacsrf=')[1];
    params = params + "ueba_csrf=" + uebacsrf + "&uebacsrf=" + uebacsrf;
    SaveCustomReportRequest.send(params);
    SaveCustomReportRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let nodeText = repListSelectedIndex.value + " | " + reportGroup + " | " + reportName + " : " + this.responseText;
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(nodeText));
            list.appendChild(entry);
            //looping through reportID 
            if (i < tableDataListArray.length) {
                var GetCustomGroupNameRequest = new XMLHttpRequest();
                GetCustomGroupNameRequest.open("GET", "../../CustomReportSettings.do?methodToCall=getCustomReportsFormData&req=%7B%7D", true);
                GetCustomGroupNameRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                GetCustomGroupNameRequest.send();
                GetCustomGroupNameRequest.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        var myArr = JSON.parse(this.responseText);
                        customGroupNameID = myArr.customGroupData[0].id;
                        // getSubCategData();
                        getSubCategDataFromReport();
                    }
                };
            }
            else {
                // saving report finished setting default value to save next reports
                i = 0;
                customGroupNameID = -1;
                tableDataListArray = [];
            }
        }
    };





}
var list = document.getElementById('demo');

function retrievePatternFields(reportID, reportName, reportGroup, patternData, patternPresent) {
    let nodeText = document.getElementById("repList")[selDropDownValue].value + " | " + reportGroup + " | " + reportName;
    if (patternData.length > 0) {
        nodeArray = [];
        for (let i = 0; i < patternData.length; i++) {
            nodeArray[i] = patternData[i].id;
        }
        nodeObject[reportID] = []; //baseArray
        nodeObject[reportID][0] = nodeArray; //innerArray
        if (nodeObject[reportID][0].includes(10) && nodeObject[reportID][0].includes(12)) {
            let temp = nodeObject[reportID][0];
            let ind = temp.indexOf(10);
            temp[ind] = 12;
            ind = temp.indexOf(12);
            temp[ind] = 10;
            nodeObject[reportID][1] = temp;
        }
        nodeText = nodeText + "::" + JSON.stringify(nodeObject);
    }
    if (i == tableDataListArray.length) {
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(nodeText));
        list.appendChild(entry);
    }
    if (i < tableDataListArray.length) {
        var GetCustomGroupNameRequest = new XMLHttpRequest();
        GetCustomGroupNameRequest.open("GET", "../../CustomReportSettings.do?methodToCall=getCustomReportsFormData&req=%7B%7D", true);
        GetCustomGroupNameRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        GetCustomGroupNameRequest.send();
        GetCustomGroupNameRequest.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                customGroupNameID = myArr.customGroupData[0].id;
                 getSubCategDataFromReport();
            }
        };
    }
    else {
        // saving report finished, setting default value to save next reports
        i = 0;
        customGroupNameID = -1;
        tableDataListArray = [];
        nodeObject = {};
        makeRequest();
    }
 }

function makePatternView(patternArray, reportID) {
    let pamModulePatterns = { "95": [[9, 26, 10, 45, 12], [9, 26, 12, 45, 10]], "96": [[9, 26, 12, 45, 10], [9, 26, 10, 45, 12]] };
    let viewObject = {};
    viewObject['viewId'] = 18;
    viewObject['viewName'] = 'PatterView';
    viewObject['anomalyType'] = 2;
    viewObject['frequency'] = 0;
    viewObject['seasonality'] = false;
    let columnListArray = [];
    for (let i = 1; i <= pamModulePatterns[reportID].length; i++) { // hardToDecide - need to verify
        columnObject = {};
        columnObject['id'] = i;
        let innerColumnListArray = [];
        let lengthToCut = 0;
        for (let j = 0; j < pamModulePatterns[reportID][i - 1].length; j++) {
            nodeToAppend = {};
            nodeToAppend['id'] = pamModulePatterns[reportID][i - 1][j];
            nodeToAppend['value'] = patternArray.find(o => o.id === pamModulePatterns[reportID][i - 1][j]);
            innerColumnListArray[j] = nodeToAppend;
        }
        columnObject['columnList'] = innerColumnListArray;
        columnObject['columnListLength'] = innerColumnListArray.length - 1;
        if (i >= 2) {
            columnObject['marginTop'] = true;
        }
        else columnObject['marginTop'] = false;
        columnListArray[i - 1] = columnObject;

    }
    viewObject['columnList'] = columnListArray;
    return viewObject;
}
