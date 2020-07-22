/* /*let repList;
let reportID = 0;
let customGroupNameID = -1;
let buildNo = 4020;

function makeRequest() {
    repList = document.getElementById("repList");
    reportID = repList.value;
    console.log("hai");
    getSubCategData();

    /*            const GetBuildNo =new XMLHttpRequest();
                GetBuildNo.open("GET", "License.do?methodToCall=getDetails&req=%7B%7D", true);
                GetBuildNo.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                GetBuildNo.send();
                GetBuildNo.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let myArr = JSON.parse(this.responseText);

                    }
                    };
}

function getSubCategData() {
    const GetSubCategDataRequest = new XMLHttpRequest();
    GetSubCategDataRequest.open("GET", "CustomReportSettings.do?methodToCall=getSubCategDataFromReport&req=%7B%22reportID%22%3A" + reportID + "%7D", true);   // %7B%22reportID%22%3A48%7D
    GetSubCategDataRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    GetSubCategDataRequest.send();
    GetSubCategDataRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const repList = document.getElementById("repList");
            let subCategoryListArray = [];
            let myArr = JSON.parse(this.responseText);
            console.log("myArr.subCategoryData.dropdownList.length " + myArr.subCategoryData.dropdownList.length);
            for (let i = 0; i < myArr.subCategoryData.dropdownList.length; i++) {
                subCategoryListArray.push(myArr.subCategoryData.dropdownList[i].id);
                console.log("dropdownListID = i" + i + " & " + myArr.subCategoryData.dropdownList[i].id);
                console.log("subCategoryListArray " + JSON.stringify(subCategoryListArray));
            }
            saveCustomReport(subCategoryListArray);
        }
    };
}

function getCustomGroupName() {
    var GetCustomGroupNameRequest = new XMLHttpRequest();
    GetCustomGroupNameRequest.open("GET", "CustomReportSettings.do?methodToCall=getCustomReportsFormData&req=%7B%7D", true);
    GetCustomGroupNameRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    GetCustomGroupNameRequest.send();
    GetCustomGroupNameRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var myArr = JSON.parse(this.responseText);
            customGroupNameID = myArr.customGroupData[0].id;
            console.log("afterchange" + customGroupNameID);
            getSubCategData();
        }
    };
}

function saveCustomReport(subCategoryListArray) {
    var GetReportName = new XMLHttpRequest();
    GetReportName.open("GET", "report.do?methodToCall=getReportInputParams&req=%7B%22reportId%22%3A" + reportID + "%7D", true);
    GetReportName.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    GetReportName.send();
    GetReportName.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(JSON.parse(this.response));
            let reportName = "cr" + JSON.parse(this.responseText).inputParams.reportDetailsMap.TITLE;
            console.log(reportName + " reportname");
            var SaveCustomReportRequest = new XMLHttpRequest();
            SaveCustomReportRequest.open("POST", "CustomReportSettings.do?methodToCall=saveCustomReport", true);
            SaveCustomReportRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            console.log(customGroupNameID);
            console.log("subCategoryData" + JSON.stringify(subCategoryListArray));
            var params = "{\"reportName\":\"" + reportName + "\",\"addGroupName\":\"m" + repList.options[repList.selectedIndex].innerHTML + "\",\"GroupNameId\":" + customGroupNameID + ",\"description\":\"\",\"viewsData\":\"%5B%7B%5C%22viewId%5C%22%3A1%2C%5C%22viewName%5C%22%3A%5C%22time_15m%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A2%2C%5C%22viewName%5C%22%3A%5C%22time_30m%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A1%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A4%2C%5C%22viewName%5C%22%3A%5C%22time_1hr%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A2%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A6%2C%5C%22viewName%5C%22%3A%5C%22time_2hr%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A3%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A8%2C%5C%22viewName%5C%22%3A%5C%22count_1hr%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A10%2C%5C%22viewName%5C%22%3A%5C%22count_6hr%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A1%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A12%2C%5C%22viewName%5C%22%3A%5C%22count_12hr%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A2%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A14%2C%5C%22viewName%5C%22%3A%5C%22count_24hr%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A3%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A16%2C%5C%22viewName%5C%22%3A%5C%22seas%5C%22%2C%5C%22columnList%5C%22%3A%5B1%5D%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Atrue%7D%5D\",\"selectedReportID\":" + reportID + ",\"subCategoryList\":" + JSON.stringify(subCategoryListArray) + ",\"filterList\":[]}";
            params = "req=" + params + "&";
            var uebacsrf = document.cookie.split('uebacsrf=')[1];
            params = params + "ueba_csrf=" + uebacsrf + "&uebacsrf=" + uebacsrf;
            SaveCustomReportRequest.send(params);
            SaveCustomReportRequest.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (reportID <= repList.options[repList.selectedIndex + 1].value - 1) {
                        reportID++;
                        if (reportID === parseInt(repList.value) + 1) getCustomGroupName();
                        else getSubCategData();
                    }
                    else {
                        document.getElementById("result").innerHTML = "finished";

                    }
                }
            };
        }
    };
}

function formRequest(method, url, contentType, params) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(method, url, true);
    xmlHttpRequest.setRequestHeader("Content-Type", contentType);
    if (method === "post") xmlHttpRequest.send(params);
    else xmlHttpRequest.send();
    xmlHttpRequest.onreadystatechange = function () {
    };
}

 */
function makeRequest() {
    getSubcategDataTableData(document.getElementById("repList")[document.getElementById("repList").selectedIndex].id);
}
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
                // console.log("hi"+this.responseText);
                // console.log("responseFormData = " + JSON.stringify(responseFormData));
                var categoryDataList = responseFormData.categData;
                console.log(typeof categoryDataList);
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
function getSubcategDataTableData(categID) {
    var GetSubcategDataTableData = new XMLHttpRequest();
    var req = "%7B%22inputParams%22%3A%7B%22tableInputParams%22%3A%7B%22hideTableBottomOptions%22%3Atrue%2C%22sortColumn%22%3A%22UEBA_REPORT_NAME%22%2C%22hideTopDivider%22%3Atrue%2C%22rangeList%22%3A%5B%7B%22value%22%3A25%7D%2C%7B%22value%22%3A50%7D%2C%7B%22value%22%3A75%7D%2C%7B%22value%22%3A100%7D%5D%2C%22showSearchMethod%22%3A%22searchAction%22%2C%22showSearch%22%3Atrue%2C%22sortOrder%22%3A%22ASC%22%2C%22startValue%22%3A1%2C%22rangeValue%22%3A25%2C%22totalCount%22%3A7%2C%22searchData%22%3A%7B%7D%2C%22selectedCategID%22%3A2%7D%2C%22selectedCategID%22%3A%22" + categID + "%22%7D%7D";
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
            console.log("myArr.subCategoryData.dropdownList.length " + myArr.subCategoryData.dropdownList.length);
            for (let index = 0; index < myArr.subCategoryData.dropdownList.length; index++) {
                subCategoryListArray.push(myArr.subCategoryData.dropdownList[index].id);
                console.log("dropdownListID = i" + index + " & " + myArr.subCategoryData.dropdownList[index].id);
                console.log("subCategoryListArray " + JSON.stringify(subCategoryListArray));
            }
            for (let iindex = 0; iindex < myArr.columnTypeData.dropdownList.length; iindex++) {
                columnList.push(myArr.columnTypeData.dropdownList[iindex].id);
                console.log("dropdownListID = i" + iindex + " & " + myArr.columnTypeData.dropdownList[iindex].id);
                // console.log("subCategoryListArray " + JSON.stringify(columnTypeData));
            }
            i++;
            saveCustomReport(subCategoryListArray, JSON.stringify(columnList), reportID, reportName, reportGroup);
        }
    };
}

function saveCustomReport(subCategoryListArray, columnList, reportID, reportName, reportGroup) {
    var SaveCustomReportRequest = new XMLHttpRequest();
    if (i == 1) {
        var GetCustomGroupNameRequest = new XMLHttpRequest();
        GetCustomGroupNameRequest.open("GET", "../../CustomReportSettings.do?methodToCall=getCustomReportsFormData&req=%7B%7D", true);
        GetCustomGroupNameRequest.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        GetCustomGroupNameRequest.send();
        GetCustomGroupNameRequest.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                customGroupNameID = myArr.customGroupData[0].id+1;
                console.log("afterchange" + customGroupNameID);
                // getSubCategData();
            }
        };
    }

    SaveCustomReportRequest.open("POST", "../../CustomReportSettings.do?methodToCall=saveCustomReport", true);
    SaveCustomReportRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(customGroupNameID);

    console.log("subCategoryData" + JSON.stringify(subCategoryListArray));
    var params = "{\"reportName\":\"3" + reportName + "\",\"addGroupName\":\"3" +
        repList.options[repList.selectedIndex].innerHTML + "\",\"GroupNameId\":" + customGroupNameID +
        ",\"description\":\"" + reportGroup + "\",\"viewsData\":\"%5B%7B%5C%22viewId%5C%22%3A1%2C%5C%22viewName%5C%22%3A%5C%22time_15m%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A2%2C%5C%22viewName%5C%22%3A%5C%22time_30m%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A1%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A4%2C%5C%22viewName%5C%22%3A%5C%22time_1hr%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A2%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A6%2C%5C%22viewName%5C%22%3A%5C%22time_2hr%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A0%2C%5C%22frequency%5C%22%3A3%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A8%2C%5C%22viewName%5C%22%3A%5C%22count_1hr%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A10%2C%5C%22viewName%5C%22%3A%5C%22count_6hr%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A1%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A12%2C%5C%22viewName%5C%22%3A%5C%22count_12hr%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A2%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A14%2C%5C%22viewName%5C%22%3A%5C%22count_24hr%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A3%2C%5C%22seasonality%5C%22%3Afalse%7D%2C%7B%5C%22viewId%5C%22%3A16%2C%5C%22viewName%5C%22%3A%5C%22seas%5C%22%2C%5C%22columnList%5C%22%3A"+ columnList + "%2C%5C%22anomalyType%5C%22%3A1%2C%5C%22frequency%5C%22%3A0%2C%5C%22seasonality%5C%22%3Atrue%7D%5D\",\"selectedReportID\":" + reportID + ",\"subCategoryList\":" + JSON.stringify(subCategoryListArray) + ",\"filterList\":[]}";
    params = "req=" + params + "&";
    var uebacsrf = document.cookie.split('uebacsrf=')[1];
    params = params + "ueba_csrf=" + uebacsrf + "&uebacsrf=" + uebacsrf;
    SaveCustomReportRequest.send(params);
    SaveCustomReportRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (i < tableDataListArray.length) {
                getSubCategDataFromReport();
            }
            else {
                i=0;
                customGroupNameID=-1;
                tableDataListArray = [];
            }
        }
    };
}