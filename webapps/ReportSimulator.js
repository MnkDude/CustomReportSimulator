let repListSelectedIndex = 0;
let dropdownLength = 0;
let selDropDownValue = 0;
function makeRequest() {
    reportGroupNamePrefix = Date.now();
    repListSelectedIndex = document.getElementById("repList")[document.getElementById("repList").selectedIndex];
    getSubcategDataTableData(repListSelectedIndex.id);
    // dropdownLength = document.getElementById('repList').length;
    // if (selDropDownValue < dropdownLength) {
    // getSubcategDataTableData(document.getElementById("repList")[selDropDownValue].id);
    // selDropDownValue++;
    // }
}

function getRequestObject(method, request, params) {
    let RequestObject = new XMLHttpRequest();
    RequestObject.open(method, request, true);
    if (method == "POST") {
        RequestObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        RequestObject.send(params);
    }
    else {
        RequestObject.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        RequestObject.send();
    }
    return RequestObject;
}

//Initial start
getCategoryList();
function getCategoryList() {
    for (let index = 1; index <= 4; index++) {
        let GetCategoryList = getRequestObject("GET", "../../CustomReportSettings.do?methodToCall=getCategoryList&req=%7B%22moduleID%22%3A%22" + index + "%22%7D");
        GetCategoryList.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let responseFormData = JSON.parse(this.responseText);
                let categoryDataList = responseFormData.categData;
                let selectList = document.getElementById("repList");
                for (let i = categoryDataList.length - 1; i >= 0; i--) {
                    let option = document.createElement('option');
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
    let req = "%7B%22inputParams%22%3A%7B%22tableInputParams%22%3A%7B%22hideTableBottomOptions%22%3Atrue%2C%22sortColumn%22%3A%22UEBA_REPORT_NAME%22%2C%22hideTopDivider%22%3Atrue%2C%22rangeList%22%3A%5B%7B%22value%22%3A25%7D%2C%7B%22value%22%3A50%7D%2C%7B%22value%22%3A75%7D%2C%7B%22value%22%3A100%7D%5D%2C%22showSearchMethod%22%3A%22searchAction%22%2C%22showSearch%22%3Atrue%2C%22sortOrder%22%3A%22ASC%22%2C%22startValue%22%3A1%2C%22rangeValue%22%3A100%2C%22totalCount%22%3A7%2C%22searchData%22%3A%7B%7D%2C%22selectedCategID%22%3A2%7D%2C%22selectedCategID%22%3A%22" + categID + "%22%7D%7D";
    let GetSubcategDataTableData = getRequestObject("GET", "../../CustomReportSettings.do?methodToCall=getSubcategDataTableData&req=" + req);
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
    const GetSubCategDataRequest = getRequestObject("GET", "../../CustomReportSettings.do?methodToCall=getSubCategDataFromReport&req=%7B%22reportID%22%3A" + reportID + "%7D");
    GetSubCategDataRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
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
                patternViewObject = makePatternView(patternData, reportID, retrievePatternFields(reportID, patternData));
            }
            saveCustomReport(subCategoryListArray, JSON.stringify(columnList), reportID, reportName, reportGroup, patternViewObject, patternPresent);
        }
    };
}
let reportGroupNamePrefix = 0;

// saving customreport with all views by retrieving customgroupname ID
function saveCustomReport(subCategoryListArray, columnList, reportID, reportName, reportGroup, patternViewObject, patternPresent) {
    let reportNamePrefix = Date.now();
    let params = "{\"reportName\":\"" + reportNamePrefix + reportName + "\",\"addGroupName\":\"" + reportGroupNamePrefix +
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
    let uebacsrf = document.cookie.split('uebacsrf=')[1];
    params = params + "ueba_csrf=" + uebacsrf + "&uebacsrf=" + uebacsrf;
    let SaveCustomReportRequest = getRequestObject("POST", "../../CustomReportSettings.do?methodToCall=saveCustomReport", params);
    SaveCustomReportRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let nodeText = repListSelectedIndex.value + " | " + reportGroup + " | " + reportName + " : " + this.responseText;
            let entry = document.createElement('li');
            entry.appendChild(document.createTextNode(nodeText));
            list.appendChild(entry);
            //looping through reportID 
            if (i < tableDataListArray.length) {
                let GetCustomGroupNameRequest = getRequestObject("GET", "../../CustomReportSettings.do?methodToCall=getCustomReportsFormData&req=%7B%7D");
                GetCustomGroupNameRequest.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let myArr = JSON.parse(this.responseText);
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
let list = document.getElementById('demo');
let nodeObject = {};
/*function selectPatArray(reportCatID) {
    let patArray = [];
    switch (reportCatID) {
        case 2:
            patArray = { "1": [[2, 3, 4, 6, 7, 8, 9]], "2": [[2, 3, 4, 6, 7, 8, 9]], "3": [[2, 3, 4, 6, 7, 8, 9]], "4": [[2, 3, 4, 6, 7, 8, 9]], "5": [[2, 3, 4, 6, 7, 8, 9]], "6": [[2, 3, 4, 6, 7, 8, 9]], "7": [[2, 3, 4, 6, 7, 8, 9]] };
            break;
        case 3:
            patArray = {"15":[[10,11,12,14,16,9]],"16":[[10,11,12,14,16,9]],"17":[[10,11,12,14,16,9]],"18":[[10,11,12,14,15,16,9]],"19":[[10,11,12,14,15,16,9]],"20":[[10,11,12,14,15,16,9]],"21":[[10,11,12,14,15,16,9]],"22":[[10,11,12,14,15,16,9]],"23":[[10,12,9]],"24":[[10,12,9]],"25":[[10,11,12,14,15,16,9]],"26":[[10,11,12,14,15,16,9]],"27":[[10,12,19,9]],"29":[[10,11,12,14,15,16,9]],"30":[[10,11,12,14,15,16,9]],"31":[[10,11,12,14,15,16,9]],"32":[[10,11,12,14,15,16,9]],"33":[[10,11,12,14,15,16,9]],"34":[[10,11,12,14,15,16,9]]};
        break;
        case 4:
            patArray = {"35":[[10,9]],"36":[[10,12,9]],"37":[[10,12,26,107,109,9]],"38":[[10,16,107,25,9]],"39":[[10,25,9]],"40":[[10,12,26,20,9]],"41":[[10,12,26,20,9]],"42":[[10,12,26,20,9]],"43":[[10,12,26,20,9]],"44":[[10,12,26,9]],"45":[[10,12,26,9]],"46":[[10,12,26,30,31,27,32,9]],"47":[[10,12,26,9]],"48":[[10,12,26,27,20,21,29,9]],"49":[[10,12,16,9]],"50":[[10,12,16,9]],"51":[[10,12,16,9]],"52":[[10,12,16,9]],"53":[[10,33,34,9]],"54":[[10,33,36,37,20,9]],"55":[[10,20,9]],"56":[[12,19,38,26,10,39,20,9]],"58":[[10,12,26,16,101,29,9]],"59":[[10,12,26,16,101,29,9]],"60":[[10,12,26,16,101,29,9]],"61":[[10,12,26,16,101,29,9]],"62":[[10,12,26,16,29,9]],"63":[[10,12,26,16,101,29,9]],"64":[[10,12,19,26,16,104,103,9]],"65":[[10,12,19,26,16,104,103,9]],"66":[[10,12,19,26,16,104,103,9]],"67":[[10,12,19,26,16,104,103,9]],"68":[[10,12,26,16,103,9]],"69":[[10,12,26,106,16,9]]}
        break;
        case 5:
            patArray = {"70":[[10,42,9]],"71":[[10,42,9]],"72":[[10,12,43,9]],"73":[[10,12,19,45,9]],"74":[[10,12,19,45,9]],"75":[[10,12,19,45,9]],"76":[[10,12,19,45,9]],"77":[[10,12,19,45,9]],"78":[[10,12,19,45,9]],"79":[[10,12,19,45,9]],"80":[[10,12,19,45,9]],"81":[[10,12,19,45,9]],"82":[[10,12,19,45,9]],"83":[[10,12,19,45,9]],"84":[[10,12,19,45,9]],"89":[[10,12,19,114,9]],"90":[[10,12,19,114,9]]}
        break;
        case 6:
            patArray =
        break;
        case 8:
            patArray =
        break;
        case 9:
            patArray =
        break;
        case 10:
            patArray =
        break;
        case 11:
            patArray =
        break;
        case 12:
            patArray =
        break;
        case 13:
            patArray =
        break;
        case 14:
            patArray =
        break;
        case 15:
            patArray =
        break;
        case 16:
            patArray =
        break;
        case 17:
            patArray =
        break;
        case 18:
            patArray =
        break;
        case 19:
            patArray =
        break;
        case 20:
            patArray =
        break;
        case 21:
            patArray =
        break;
        case 22:
            patArray =
        break;
        case 23:
            patArray =
        break;
        case 24:
            patArray =
        break;
        case 25:
            patArray =
        break;
        case 26:
            patArray =
        break;
        case 27:
            patArray =
        break;
        case 28:
            patArray =
        break;
    }
}
*/

function retrievePatternFields(reportID, patternData) {
    let nodeText = document.getElementById("repList")[document.getElementById("repList").selectedIndex].value;
    let selectReportGroup = document.getElementById("repList")[document.getElementById("repList").selectedIndex].id;
    if (patternData.length > 0) {
        nodeArray = [];
        for (let i = 0; i < patternData.length; i++) {
            nodeArray[i] = patternData[i].id;

        }
        nodeObject[reportID] = []; //baseArray
        if (selectReportGroup == 8) {
            let index = nodeArray.indexOf(9);
            let index1 = nodeArray.indexOf(10);
            nodeArray[index] = 10;
            nodeArray[index1] = 9;
        }
        nodeObject[reportID][0] = nodeArray; //innerArray
        if (nodeObject[reportID][0].includes(10) && nodeObject[reportID][0].includes(12)) {
            let temp = [...nodeObject[reportID][0]];
            let index = temp.indexOf(10);
            let index2 = temp.indexOf(12);
            temp[index] = 12;
            temp[index2] = 10;
            console.log(temp);

            nodeObject[reportID][nodeObject[reportID].length] = temp;

        }
        if (nodeObject[reportID][0].length > 1 && nodeObject[reportID][0].includes(9)) {
            let temp = [...nodeObject[reportID][0]];
            temp[temp.indexOf(9)] = temp[temp.length - 1];
            temp.pop();
            nodeObject[reportID][nodeObject[reportID].length] = temp;
        }
        if (nodeObject[reportID][0].length > 5) {
            let temp = [...nodeObject[reportID][0]];
            temp.length = 5;
            nodeObject[reportID][nodeObject[reportID].length] = temp;
        } // 19 45
        if (selectReportGroup == 5) {
            if (nodeObject[reportID][0].includes(19) && nodeObject[reportID][0].includes(45)) {
                let temp = [];
                temp.push(19); temp.push(45);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
        }
        else if (selectReportGroup == 26) {
            if (nodeObject[reportID][0].includes(12) && nodeObject[reportID][0].includes(149)) {
                let temp = [];
                temp.push(12); temp.push(149);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
            if (nodeObject[reportID][0].includes(150) && nodeObject[reportID][0].includes(149)) {
                let temp = [];
                temp.push(150); temp.push(149);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
        }
        else if (selectReportGroup == 27) {
            if (nodeObject[reportID][0].includes(12) && nodeObject[reportID][0].includes(136)) {
                let temp = [];
                temp.push(12); temp.push(136);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
            if (nodeObject[reportID][0].includes(136) && nodeObject[reportID][0].includes(137)) {
                let temp = [];
                temp.push(136); temp.push(137);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
        }
        else if (selectReportGroup == 28) {
            if (nodeObject[reportID][0].includes(12) && nodeObject[reportID][0].includes(156)) {
                let temp = [];
                temp.push(12); temp.push(156);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
            if (nodeObject[reportID][0].includes(156) && nodeObject[reportID][0].includes(157)) {
                let temp = [];
                temp.push(156); temp.push(157);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
        }
        else if (selectReportGroup >= 12 && selectReportGroup <= 25) {
            if (nodeObject[reportID][0].includes(47) && nodeObject[reportID][0].includes(55) && nodeObject[reportID][0].includes(57) && nodeObject[reportID][0].includes(58)) {
                let temp = [];
                temp.push(47); temp.push(55); temp.push(57); temp.push(58);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
            if (nodeObject[reportID][0].includes(47) && nodeObject[reportID][0].includes(55)) {
                let temp = [];
                temp.push(47); temp.push(55);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
            if (nodeObject[reportID][0].includes(57) && nodeObject[reportID][0].includes(58)) {
                let temp = [];
                temp.push(57); temp.push(58);
                nodeObject[reportID][nodeObject[reportID].length] = temp;
            }
        }


        // nodeText = nodeText + "::" + JSON.stringify(nodeObject);
    }
    /*  else {
         nodeText = nodeText + ":: " + JSON.stringify(nodeObject);
     }
     if (i == tableDataListArray.length) {
         let entry = document.createElement('li');
         entry.appendChild(document.createTextNode(nodeText));
         list.appendChild(entry);
     } */
    /*     if (i < tableDataListArray.length) {
            let GetCustomGroupNameRequest = getRequestObject("GET", "../../CustomReportSettings.do?methodToCall=getCustomReportsFormData&req=%7B%7D");
            GetCustomGroupNameRequest.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let myArr = JSON.parse(this.responseText);
                    customGroupNameID = myArr.customGroupData[0].id;
                    // getSubCategData();
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
            // makeRequest();
        } */
    return nodeObject;
}

function makePatternView(patternArray, reportID, patternModel) {
    let pamModulePatterns = { "95": [[9, 26, 10, 45, 12], [9, 26, 12, 45, 10]], "96": [[9, 26, 12, 45, 10], [9, 26, 10, 45, 12]] };
    let viewObject = {};
    viewObject['viewId'] = 18;
    viewObject['viewName'] = 'PatterView';
    viewObject['anomalyType'] = 2;
    viewObject['frequency'] = 0;
    viewObject['seasonality'] = false;
    let columnListArray = [];
    for (let i = 1; i <= patternModel[reportID].length; i++) { // hardToDecide - need to verify
        columnObject = {};
        columnObject['id'] = i;
        let innerColumnListArray = [];
        let lengthToCut = 0;
        for (let j = 0; j < patternModel[reportID][i - 1].length; j++) {
            nodeToAppend = {};
            nodeToAppend['id'] = patternModel[reportID][i - 1][j];
            nodeToAppend['value'] = patternArray.find(o => o.id === patternModel[reportID][i - 1][j]);
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
