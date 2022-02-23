
window.onload = (event) => {
  setTimeout(() => {$("#loader-box").fadeOut()}, 1000);

  console.log('page is fully loaded');
  getAll();
  $('#department-department-searchbar-con').hide();
  $('#department-location-searchbar-con').hide();
  $('#location-location-searchbar-con').hide();
};

var departmentsArray = [];
var departmentsIds = [];
var locationsArray = [];
var locationsIdarray = [];

//----------------------------------------------------------------------------------EMPLOYEES
function getAll() {
    $.ajax({
        url: 'libs/php/getAll.php',
        type: 'POST',
        datatype: 'json',
        data: {
        },
        success: function(result) {
            fillTable(result.data);
            //console.log(result);

        },
        error: function(error) {
            console.log(error);
        }
    });
}
function fillTable(data){

  $('#table-body').html('');

  data.forEach(employee => {

    let tableRow = `
    <tr class="table-row">
      <td id="employeeFirstName${employee.id}" class="table-cell">${employee.firstName}</td>
      <td id="employeeLastName${employee.id}"class="table-cell">${employee.lastName}</td>
      <td id="employeeDepartment${employee.id}"class="table-cell">${employee.name}</td>
      <td id="employeeLocation${employee.id}" class="table-cell">${employee.location}</td>
      <td><button id="employeeViewProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#viewProfile"><i class="fas fa-eye interact-button"></i></button>
      <button id="employeeEditProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="employeeDelete${employee.id}" data-bs-toggle="modal" data-bs-target="#deleteProfile"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body').append(tableRow);

    //delete eomployee profile
    $(`#employeeDelete${employee.id}`).on('click', function() {
      fillDeleteEmployee(employee);
  });

    //edit employee
    $(`#employeeEditProfile${employee.id}`).on('click', function() {
      fillEditProfile(employee);
    });

    //view employee
    $(`#employeeViewProfile${employee.id}`).on('click', function() {
      var viewFirstName = employee.firstName;
      var viewLastName = employee.lastName;
      var viewDepartment = employee.name;
      var viewLocation = employee.location;
      var viewEmail = employee.email;
      var viewJobTitle = employee.jobTitle;
      viewProfile(viewFirstName,viewLastName,viewDepartment,viewLocation,viewEmail,viewJobTitle);
  });
  });
}

//add employee
$('#addBtn').on('click', function() {
    $('#add-user-error-text').html('');
    fillDepartmentList($('#departmentSelect'));
    fillLocationList($('#add-location-select'));

    $('#add-location-error-text').html('');
    $('#add-department-error-text').html('');
    $('#add-location').val(' ');
    $('#add-department-name').val(' ');
    $('#addUserForm').trigger("reset");
});

$('#add-user-btn').on('click', function() {
    var addFirstName = toTitleCase($('#add-fname').val());
    var addLastName = toTitleCase($('#add-lname').val());
    var addJobTitle = toTitleCase($('#job-title').val());
    var addEmail = $('#email').val();
    var addDepartment = $('#departmentSelect').val();

    if(addEmail.includes('@')){
      if(addFirstName.length == 0 || addLastName.length == 0){
        $('#add-user-error-text').html('First name and last name required.');
      } else {
        addProfile(addFirstName,addLastName,addJobTitle,addEmail,addDepartment);
      }
    } else {
      $('#add-user-error-text').html('Email requires "@"');
    }
});

//view profile
function viewProfile(viewFirstName,viewLastName,viewDepartment,viewLocation,viewEmail,viewJobTitle){
  $('#view-first-name').html(viewFirstName);
  $('#view-last-name').html(viewLastName);
  $('#view-department').html(viewDepartment);
  $('#view-location').html(viewLocation);
  $('#view-email').html(viewEmail);
  $('#view-job-title').html(viewJobTitle);
}

//edit employee
function fillEditProfile(employee){
  $('#edit-user-error-text').html('');
  fillDepartmentList($('#edit-department-dropdown'));
  $('#edit-fname').val(`${employee.firstName}`);
  $('#edit-lname').val(`${employee.lastName}`);
  $('#edit-job-title').val(`${employee.jobTitle}`);
  $('#edit-email').val(`${employee.email}`);
  $('#edit-employee-id').html(`${employee.id}`);
  console.log(employee);
  console.log(employee.department);

  let depOption = document.createElement('option');
  depOption.value =  employee.department;

  if(employee.name){
    depOption.text = employee.name;
  } else {
    depOption.text = employee.department;
  }

  $("#edit-department-dropdown").append(depOption);
}

$('#edit-submit-btn').on('click', function() {
    var editFirstName = toTitleCase($('#edit-fname').val());
    var editLastName = toTitleCase($('#edit-lname').val());
    var editJobTitle = toTitleCase($('#edit-job-title').val());
    var editEmail = toTitleCase($('#edit-email').val());
    var editDepartment = $('#edit-department-dropdown').val();
    var editEmployeeId = $('#edit-employee-id').html();


    if(editEmail.includes('@')){
      if(editFirstName.length == 0 || editLastName.length == 0){
        $('#edit-user-error-text').html('First name and last name required.');
      } else {
        editProfile(editFirstName,editLastName,editJobTitle,editEmail,editDepartment,editEmployeeId);
      }
    } else {

      $('#edit-user-error-text').html('Email requires "@"');
    }
});

//delete employee
function fillDeleteEmployee(employee){
  $('#employee-name').html(`${employee.firstName} ${employee.lastName}`);
  $('#employee-id').html(`${employee.id}`);
}

$('#confirm-delete-profile-btn').on('click', function(e) {
    var employeeId = $('#employee-id').html();
    deleteEmployee(employeeId);
    //console.log(employeeId + 'deleted');
});

//add employee
function addProfile(addFirstName,addLastName,addJobTitle,addEmail,addDepartment){
  $.ajax({
      url: 'libs/php/addUser.php',
      type: 'POST',
      datatype: 'json',
      data: {
        fname: addFirstName,
        lname: addLastName,
        jobTitle: addJobTitle,
        email: addEmail,
        department: addDepartment
      },
      success: function(result) {
        //console.log(result);
        $('#addUserForm').trigger("reset");
        $('#addUser').modal('hide');
        getAll();

        successfulPopup('Added', 'Employee');

      },
      error: function(error) {
          console.log(error);
          failedPopup('Add', 'Employee');
      }
  });
}

//edit employee
function editProfile(editFirstName,editLastName,editJobTitle,editEmail,editDepartment,editEmployeeId){
  $.ajax({
      url: 'libs/php/editProfile.php',
      type: 'POST',
      datatype: 'json',
      data: {
        fname: editFirstName,
        lname: editLastName,
        jobTitle: editJobTitle,
        email: editEmail,
        department: editDepartment,
        employeeId: editEmployeeId
      },
      success: function(result) {

          //console.log(result);
          $('#editProfile').modal('hide');
          getAll();
          successfulPopup('Edited', 'Employee');

      },
      error: function(error) {
          console.log(error);
          failedPopup('Edit', 'Employee');
      }
  });
}

//delete employee
function deleteEmployee(employeeId) {
    $.ajax({
        url: 'libs/php/deleteProfile.php',
        type: 'POST',
        datatype: 'json',
        data: {employeeId: employeeId
        },
        success: function(result) {
          //console.log(result);

            //console.log('profile deleted');
            $('#deleteProfile').modal('hide');
            getAll();
            successfulPopup('Deleted', 'Employee');

        },
        error: function(error) {
            console.log(error);
            failedPopup('Delete', 'Employee');
        }
    });
}

//----------------------------------------------------------------------------------DEPARTMENTS
function getDepartments() {
  departmentsArray = [];
  departmentsIds = [];

    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        datatype: 'json',
        data: {
        },
        success: function(result) {
            fillDepartmentTable(result.data);
            //console.log(result);

            result.data.forEach(element => {
              //var elementName = element.name.toLowerCase();
              //departmentsArray.push(elementName);
                  departmentsArray.push(element.name.toLowerCase());

                  departmentsIds.push(element.id);
              });


        },
        error: function(error) {
            console.log(error);
        }
    });
}

function fillDepartmentTable(data){
  $('#table-body-departments').html('');

  data.forEach(department => {

    let departmentTable = `
    <tr class="table-row">
      <td id="departmentName${department.id}" class="table-cell">${department.name}</td>
      <td id="departmentLocation${department.id}" class="table-cell">${department.location}</td>
      <td id="departmentQuantity${department.id}" class="table-cell"></td>
      <td>
      <button id="departmentEditProfile${department.id}" data-bs-toggle="modal" data-bs-target="#editDepartment"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="departmentDelete${department.id}"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body-departments').append(departmentTable);


    getAllEmployeesInDepartment(department.id);

    //delete department
    $(`#departmentDelete${department.id}`).on('click', function() {


      fillDeleteDepartment(department);
      $('#deleteDepartment').modal('show');

    });

    //edit department
    $(`#departmentEditProfile${department.id}`).on('click', function() {
      //console.log('edit dep');
      fillEditDepartment(department);
    });
  });
}

//edit department
function fillEditDepartment(department){
  //console.log(department);
  fillLocationList($('#edit-location-select'));
  $('#edit-department-name').val(`${department.name}`);
  $('#edit-department-id').html(`${department.id}`);

  let locOption = document.createElement('option');
  locOption.value =  department.locationID;
  locOption.text = department.location;
  $("#edit-location-select").append(locOption);
}

$('#edit-department-btn').on('click', function(){
  console.log('edit');
  var editDepartmentId = $('#edit-department-id').html();
  var editDepartmentName = $('#edit-department-name').val();
  var editDepartmentLocation = $('#edit-location-select').val();

  editDepartmentName = toTitleCase(editDepartmentName);

  if(editDepartmentName.length <= 1 ){
    $('#edit-department-error-text').html('Department name required.');
  } else {
    editDepartment(editDepartmentName,editDepartmentLocation,editDepartmentId);
  }
});

//add dep
$('#add-department-btn').on('click', function() {
    var addDepartmentName = $('#add-department-name').val();
    var addLocationId = $('#add-location-select').val();

    addDepartmentName = toTitleCase(addDepartmentName);

    if(addDepartmentName.charAt(' ')){
      addDepartmentName = addDepartmentName.substring(1);
    }

    if(addDepartmentName.length <= 1){
      $('#add-department-error-text').html('Please fill in department name');
    } else {
      addDepartment(addDepartmentName,addLocationId);
    }
});

//delete department
function fillDeleteDepartment(department){
  $('#delete-department-name').html(department.name);
  $('#delete-department-id').html(department.id);
}

$('#delete-department-btn').on('click', function(e) {
    var departmentId = $('#delete-department-id').html();
    deleteDepartment(departmentId);
    //console.log(departmentId + 'deleted');
});

function editDepartment(editDepartmentName,editDepartmentLocation,editDepartmentId){
  $.ajax({
      url: 'libs/php/editDepartment.php',
      type: 'POST',
      datatype: 'json',
      data: {
        departmentName: editDepartmentName,
        departmentId: editDepartmentId,
        departmentLocation: editDepartmentLocation
      },
      success: function(result) {
          console.log(result);

          $('#editDepartment').modal('hide');
          getDepartments();
          successfulPopup('Edited', 'Department');


      },
      error: function(error) {
          console.log(error);
          console.log('edit dep error');
          failedPopup('Edit', 'Department');
      }
  });
}

function addDepartment(addDepartmentName,addLocationId){
  $.ajax({
        url: 'libs/php/addDepartment.php',
        type: 'POST',
        datatype: 'json',
        data: {
            department: addDepartmentName,
            locationId: addLocationId
        },
        success: function(result) {
          //console.log('success');
          $('#addDepartmentForm').trigger("reset");
          $('#addDepartment').modal('hide');
          getDepartments();
          successfulPopup('Added', 'Department');

        },
        error: function(error) {
            console.log(error);
            console.log('error');
            failedPopup('Add', 'Department');
        }
    });
}

function deleteDepartment(departmentId){
  $.ajax({
        url: 'libs/php/deleteDepartmentByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            departmentId: departmentId
        },
        success: function(result) {
          console.log(result);

          if(result['status']['description'] == 'cannot-delete'){
            $('#deleteDepartment').modal('hide');
            $('#cannotDeleteDepartment').modal('show');
            setTimeout(function(){ $('#cannotDeleteDepartment').modal('hide'); }, 3000);
          } else {
            $('#deleteDepartment').modal('hide');
            getDepartments();
            successfulPopup('Deleted', 'Department');
          }

        },
        error: function(error) {
            console.log(error);
            //console.log('error');
            failedPopup('Delete', 'Department');
        }
    });
}

//employee count
function getAllEmployeesInDepartment(departmentId){
  $.ajax({
        url: 'libs/php/getEmployeesInDepartment.php',
        type: 'POST',
        datatype: 'json',
        data: {
            departmentId: departmentId
        },
        success: function(result) {

          //console.log(result);
          //console.log('success');

          $(`#departmentQuantity${departmentId}`).html(result.data.length);

        },
        error: function(error) {
            console.log(error);
            console.log('error');
        }
    });
}

//----------------------------------------------------------------------------------locations
function getLocations() {

  locationsArray = [];
  locationsIdarray = [];

    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'POST',
        datatype: 'json',
        data: {
        },
        success: function(result) {
          //console.log(result);
            fillLocationTable(result.data);

            result.data.forEach(element => {
                locationsArray.push(element.name.toLowerCase());
                locationsIdarray.push(element.id);
            });

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function fillLocationTable(data){
  $('#table-body-locations').html('');

  data.forEach(location => {

    let locationTable = `
    <tr class="table-row">
      <td id="locationName${location.id}" class="table-cell">${location.name}</td>
      <td id="locationQuantity${location.id}" class="table-cell"></td>
      <td id="locationDepartments${location.id}" class="table-cell"></td>
      <td>
      <button id="locationEditProfile${location.id}" data-bs-toggle="modal" data-bs-target="#editLocation"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="locationDelete${location.id}"><i class="fas fa-trash interact-button"></i></button></td>

    </tr>
    `;

    $('#table-body-locations').append(locationTable);

    departmentsInLocation(location.id);
    getEmployeesInLocation(location.id);

    $(`#locationDelete${location.id}`).on('click', function() {

      fillDeleteLocation(location);
      $('#deleteLocation').modal('show');

      /*if($(`#locationQuantity${location.id}`).html() > 0){
        $('#cannotDeleteLocation').modal('show');
        console.log('cannot');
      } else {
        fillDeleteLocation(location);
        $('#deleteLocation').modal('show');
        console.log('can');
      }*/
    });

    //edit location
    $(`#locationEditProfile${location.id}`).on('click', function() {

      fillEditLocation(location);
    });

  });
}

//edit location
function fillEditLocation(location){
  $('#edit-location-id').html(location.id);
  $('#edit-location-name').val(`${location.name}`);
  console.log(location);
}

$('#edit-location-btn').on('click', function(e) {
  var editLocationName = $('#edit-location-name').val();
  var editLocationId = $('#edit-location-id').html();

  editLocationName = toTitleCase(editLocationName);

  if(editLocationName.length <= 1 ){
    $('#edit-location-error-text').html('Location name required.');
  } else {
    editLocation(editLocationName,editLocationId);
  }
});

//delete location
function fillDeleteLocation(location){
  $('#delete-location-name').html(location.name);
  $('#delete-location-id').html(location.id);
};

$('#delete-location-btn').on('click', function(e) {

    var deleteLocationId = $('#delete-location-id').html();
    deleteLocation(deleteLocationId);
    //console.log(deleteLocationId);
});

//add location
$('#add-location-btn').on('click', function() {
  var addLocationName = $('#add-location').val();
  addLocationName = toTitleCase(addLocationName);

  if(addLocationName.charAt(' ')){
    addLocationName = addLocationName.substring(1);
  }

  if(addLocationName.length <= 1){
    $('#add-location-error-text').html('Please fill in location name')
  } else {
    addLocation(addLocationName);
  }
});

function editLocation(editLocationName,editLocationId){
  $.ajax({
      url: 'libs/php/editLocation.php',
      type: 'POST',
      datatype: 'json',
      data: {
        locationName: editLocationName,
        locationId: editLocationId
      },
      success: function(result) {
        //console.log(result);
        $('#editLocation').modal('hide');
        getLocations();
        successfulPopup('Edited', 'Location');

      },
      error: function(error) {
          console.log(error);
          console.log('erros');
          failedPopup('Edit', 'Location');
      }
  });
}

function deleteLocation(deleteLocationId){
  $.ajax({
        url: 'libs/php/deleteLocationById.php',
        type: 'POST',
        datatype: 'json',
        data: {
            locationId: deleteLocationId
        },
        success: function(result) {
          console.log(result);

          if(result['status']['description'] == 'cannot-delete'){
            $('#deleteLocation').modal('hide');
            $('#cannotDeleteLocation').modal('show');
            setTimeout(function(){ $('#cannotDeleteLocation').modal('hide'); }, 3000);
          } else {
            $('#deleteLocation').modal('hide');
            getLocations();
            successfulPopup('Deleted', 'Location');
          }

        },
        error: function(error) {
            console.log(error);
            console.log('error');
            failedPopup('Delete', 'Location');
        }
    });
}

function addLocation(addLocationName){
  $.ajax({
      url: 'libs/php/addLocation.php',
      type: 'POST',
      datatype: 'json',
      data: {
        location: addLocationName
      },
      success: function(result) {
        //console.log(result);

        getLocations();
        $('#addLocation').modal('hide');
        successfulPopup('Added', 'Location');

      },
      error: function(error) {
          console.log(error);
          failedPopup('Add', 'Location');
      }
  });
}

function getEmployeesInLocation(locationId) {
    $.ajax({
        url: 'libs/php/getEmployeesInLocation.php',
        type: 'POST',
        datatype: 'json',
        data: {
            locationId: locationId
        },
        success: function(result) {

            $(`#locationQuantity${locationId}`).html(result.data.length);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function departmentsInLocation(locationId){
  $.ajax({
        url: 'libs/php/departmentsInLocation.php',
        type: 'POST',
        datatype: 'json',
        data: {
            locationId: locationId
        },
        success: function(result) {
            //console.log(result);

            $(`#locationDepartments${locationId}`).html('');

            var departments = result.data;

            departments.forEach(department => {
                $(`#locationDepartments${locationId}`)[0].insertAdjacentHTML('beforeend', `${department.name}, `)
            })

        },
        error: function(error) {
            console.log(error);
        }
    });
}

//---------------------------------------------------------------------------------Searching
///////////////////////////////////////////////////////////////////////////////////employee page search
//search by name
$('#search-addon').on('click', function() {
  console.log($('#search-bar').val());
  var txt = $('#search-bar').val();
  $('#search-bar').val('');
  searchBar(txt);
});

function searchBar(txt){
  $('#table-body').html('');
  $.ajax({
        url: 'libs/php/searchBar.php',
        method: 'POST',
        datatype: 'text',
        data: {
            search: txt
        },
        success: function(result) {
            console.log(result);

          searchFillTable(result.data);

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function searchFillTable(data){
  $('#table-body').html('');

  if(data.length < 1){
    let noData = `
    <tr class="table-row">
      <td>No Data Available</td>
      <td></td>
      <td"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
    $('#table-body').append(noData);
  }

  data.forEach(employee => {

    let tableRow = `
    <tr class="table-row">
      <td id="employeeFirstName${employee.id}" class="table-cell">${employee.firstName}</td>
      <td id="employeeLastName${employee.id}"class="table-cell">${employee.lastName}</td>
      <td id="employeeDepartment${employee.id}"class="table-cell">${employee.department}</td>
      <td id="employeeLocation${employee.id}" class="table-cell">${employee.location}</td>
      <td><button id="employeeViewProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#viewProfile"><i class="fas fa-eye interact-button"></i></button>
      <button id="employeeEditProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="employeeDelete${employee.id}" data-bs-toggle="modal" data-bs-target="#deleteProfile"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body').append(tableRow);


    //delete eomployee profile
    $(`#employeeDelete${employee.id}`).on('click', function() {
      fillDeleteEmployee(employee);
  });

    //edit employee
    $(`#employeeEditProfile${employee.id}`).on('click', function() {
      fillEditProfile(employee);
    });

    //view employee
    $(`#employeeViewProfile${employee.id}`).on('click', function() {
      var viewFirstName = employee.firstName;
      var viewLastName = employee.lastName;
      var viewDepartment = employee.name;
      var viewLocation = employee.location;
      var viewEmail = employee.email;
      var viewJobTitle = employee.jobTitle;
      viewProfile(viewFirstName,viewLastName,viewDepartment,viewLocation,viewEmail,viewJobTitle);
  });
  });
}

// search by location
$('#location-search-addon').on('click', function() {
  console.log($('#location-search-bar').val());
  var locationTxt = $('#location-search-bar').val();
  $('#location-search-bar').val('');
  locationSearchBar(locationTxt);
});

function locationSearchBar(locationTxt){
  $('#table-body').html('');
  $.ajax({
        url: 'libs/php/locationSearchBar.php',
        method: 'POST',
        datatype: 'text',
        data: {
            search: locationTxt
        },
        success: function(result) {
            console.log(result);

          locationSearchFillTable(result.data);

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function locationSearchFillTable(data){
  $('#table-body').html('');

  if(data.length < 1){
    let noData = `
    <tr class="table-row">
      <td>No Data Available</td>
      <td></td>
      <td"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
    $('#table-body').append(noData);
  }


  data.forEach(employee => {

    let tableRow = `
    <tr class="table-row">
      <td id="employeeFirstName${employee.id}" class="table-cell">${employee.firstName}</td>
      <td id="employeeLastName${employee.id}"class="table-cell">${employee.lastName}</td>
      <td id="employeeDepartment${employee.id}"class="table-cell">${employee.department}</td>
      <td id="employeeLocation${employee.id}" class="table-cell">${employee.location}</td>
      <td><button id="employeeViewProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#viewProfile"><i class="fas fa-eye interact-button"></i></button>
      <button id="employeeEditProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="employeeDelete${employee.id}" data-bs-toggle="modal" data-bs-target="#deleteProfile"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body').append(tableRow);


    //delete eomployee profile
    $(`#employeeDelete${employee.id}`).on('click', function() {
      fillDeleteEmployee(employee);
  });

    //edit employee
    $(`#employeeEditProfile${employee.id}`).on('click', function() {
      fillEditProfile(employee);
    });

    //view employee
    $(`#employeeViewProfile${employee.id}`).on('click', function() {
      var viewFirstName = employee.firstName;
      var viewLastName = employee.lastName;
      var viewDepartment = employee.name;
      var viewLocation = employee.location;
      var viewEmail = employee.email;
      var viewJobTitle = employee.jobTitle;
      viewProfile(viewFirstName,viewLastName,viewDepartment,viewLocation,viewEmail,viewJobTitle);
  });
  });
}

// search by department
$('#department-search-addon').on('click', function() {
  console.log($('#department-search-bar').val());
  var departmentTxt = $('#department-search-bar').val();
  $('#department-search-bar').val('');
  departmentSearchBar(departmentTxt);
});

function departmentSearchBar(departmentTxt){
  $('#table-body').html('');
  $.ajax({
        url: 'libs/php/departmentSearchBar.php',
        method: 'POST',
        datatype: 'text',
        data: {
            search: departmentTxt
        },
        success: function(result) {
            console.log(result);

          departmentSearchFillTable(result.data);

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function departmentSearchFillTable(data){
  $('#table-body').html('');

  if(data.length < 1){
    let noData = `
    <tr class="table-row">
      <td>No Data Available</td>
      <td></td>
      <td"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
    $('#table-body').append(noData);
  }

  data.forEach(employee => {

    let tableRow = `
    <tr class="table-row">
      <td id="employeeFirstName${employee.id}" class="table-cell">${employee.firstName}</td>
      <td id="employeeLastName${employee.id}"class="table-cell">${employee.lastName}</td>
      <td id="employeeDepartment${employee.id}"class="table-cell">${employee.department}</td>
      <td id="employeeLocation${employee.id}" class="table-cell">${employee.location}</td>
      <td><button id="employeeViewProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#viewProfile"><i class="fas fa-eye interact-button"></i></button>
      <button id="employeeEditProfile${employee.id}" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="employeeDelete${employee.id}" data-bs-toggle="modal" data-bs-target="#deleteProfile"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body').append(tableRow);

    //delete eomployee profile
    $(`#employeeDelete${employee.id}`).on('click', function() {
      fillDeleteEmployee(employee);
  });

    //edit employee
    $(`#employeeEditProfile${employee.id}`).on('click', function() {
      fillEditProfile(employee);
    });

    //view employee
    $(`#employeeViewProfile${employee.id}`).on('click', function() {
      var viewFirstName = employee.firstName;
      var viewLastName = employee.lastName;
      var viewDepartment = employee.name;
      var viewLocation = employee.location;
      var viewEmail = employee.email;
      var viewJobTitle = employee.jobTitle;
      viewProfile(viewFirstName,viewLastName,viewDepartment,viewLocation,viewEmail,viewJobTitle);
  });
  });
}


///////////////////////////////////////////////////////////////////////////////////department page search
//search department in department
$('#department-department-searchbar-search').on('click', function() {
  console.log($('#department-department-searchbar').val());
  var departmentSearchTxt = $('#department-department-searchbar').val();
  $('#department-department-searchbar').val('');
  searchDepartmentInDepartment(departmentSearchTxt);
});

function searchDepartmentInDepartment(departmentSearchTxt){
  $.ajax({
        url: 'libs/php/departmentsInDepartmentsSearchBar.php',
        method: 'POST',
        datatype: 'text',
        data: {
            search: departmentSearchTxt
        },
        success: function(result) {
            console.log(result);

          departmentInDepartmentsSearchFillTable(result.data);

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function departmentInDepartmentsSearchFillTable(data){
  $('#table-body-departments').html('');

  if(data.length < 1){
    let noData = `
    <tr class="table-row">
      <td>No Data Available</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
    $('#table-body-departments').append(noData);
  }

  data.forEach(department => {

    let departmentTable = `
    <tr class="table-row">
      <td id="departmentName${department.id}" class="table-cell">${department.name}</td>
      <td id="departmentLocation${department.id}" class="table-cell">${department.location}</td>
      <td id="departmentQuantity${department.id}" class="table-cell"></td>
      <td>
      <button id="departmentEditProfile${department.id}" data-bs-toggle="modal" data-bs-target="#editDepartment"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="departmentDelete${department.id}"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body-departments').append(departmentTable);


    getAllEmployeesInDepartment(department.id);

    //delete department
    $(`#departmentDelete${department.id}`).on('click', function() {

      if($(`#departmentQuantity${department.id}`).html() > 0){
        $('#cannotDeleteDepartment').modal('show');
      } else {
        fillDeleteDepartment(department);
        $('#deleteDepartment').modal('show');
      }

    });

    //edit department
    $(`#departmentEditProfile${department.id}`).on('click', function() {
      //console.log('edit dep');
      fillEditDepartment(department);
    });
  });

}

//search location in department
$('#department-location-searchbar-search').on('click', function() {
  console.log($('#department-location-searchbar').val());
  var locationInDepartmentTxt = $('#department-location-searchbar').val();
  $('#department-location-searchbar').val('');
  searchLocationInDepartment(locationInDepartmentTxt);
});

function searchLocationInDepartment(locationInDepartmentTxt){
  $.ajax({
        url: 'libs/php/locationInDepartmentsSearchBar.php',
        method: 'POST',
        datatype: 'text',
        data: {
            search: locationInDepartmentTxt
        },
        success: function(result) {
            console.log(result);

          locationInDepartmentsSearchFillTable(result.data);

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function locationInDepartmentsSearchFillTable(data){
  $('#table-body-departments').html('');

  if(data.length < 1){
    let noData = `
    <tr class="table-row">
      <td>No Data Available</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
    $('#table-body-departments').append(noData);
  }

  data.forEach(department => {

    let departmentTable = `
    <tr class="table-row">
      <td id="departmentName${department.id}" class="table-cell">${department.name}</td>
      <td id="departmentLocation${department.id}" class="table-cell">${department.location}</td>
      <td id="departmentQuantity${department.id}" class="table-cell"></td>
      <td>
      <button id="departmentEditProfile${department.id}" data-bs-toggle="modal" data-bs-target="#editDepartment"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="departmentDelete${department.id}"><i class="fas fa-trash interact-button"></i></button></td>
    </tr>
    `;

    $('#table-body-departments').append(departmentTable);


    getAllEmployeesInDepartment(department.id);

    //delete department
    $(`#departmentDelete${department.id}`).on('click', function() {

      if($(`#departmentQuantity${department.id}`).html() > 0){
        $('#cannotDeleteDepartment').modal('show');
      } else {
        fillDeleteDepartment(department);
        $('#deleteDepartment').modal('show');
      }

    });

    //edit department
    $(`#departmentEditProfile${department.id}`).on('click', function() {
      //console.log('edit dep');
      fillEditDepartment(department);
    });
  });

}

///////////////////////////////////////////////////////////////////////////////////location page search
//search location in location
$('#location-location-searchbar-search').on('click', function() {
  console.log($('#location-location-searchbar').val());
  var locationInLocationTxt = $('#location-location-searchbar').val();
  $('#location-location-searchbar').val('');
  searchLocationInLocation(locationInLocationTxt);
});

function searchLocationInLocation(locationInLocationTxt){
  $.ajax({
        url: 'libs/php/locationInLocationSearchBar.php',
        method: 'POST',
        datatype: 'text',
        data: {
            search: locationInLocationTxt
        },
        success: function(result) {
            console.log(result);

          locationInLocationSearchFillTable(result.data);

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function locationInLocationSearchFillTable(data){
  $('#table-body-locations').html('');

  if(data.length < 1){
    let noData = `
    <tr class="table-row">
      <td>No Data Available</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `
    $('#table-body-locations').append(noData);
  }

  data.forEach(location => {

    let locationTable = `
    <tr class="table-row">
      <td id="locationName${location.id}" class="table-cell">${location.name}</td>
      <td id="locationQuantity${location.id}" class="table-cell"></td>
      <td id="locationDepartments${location.id}" class="table-cell"></td>
      <td>
      <button id="locationEditProfile${location.id}" data-bs-toggle="modal" data-bs-target="#editLocation"><i class="fas fa-pencil-alt interact-button"></i></button>
      <button id="locationDelete${location.id}"><i class="fas fa-trash interact-button"></i></button></td>

    </tr>
    `;

    $('#table-body-locations').append(locationTable);

    departmentsInLocation(location.id);
    getEmployeesInLocation(location.id);

    $(`#locationDelete${location.id}`).on('click', function() {

      if($(`#locationQuantity${location.id}`).html() > 0){
        $('#cannotDeleteLocation').modal('show');
        console.log('cannot');
      } else {
        fillDeleteLocation(location);
        $('#deleteLocation').modal('show');
        console.log('can');
      }
    });

    //edit location
    $(`#locationEditProfile${location.id}`).on('click', function() {

      fillEditLocation(location);
    });

  });
}


//refresh button
$(`#employeeRefreshBtn`).on('click', function() {
console.log('all');
getAll();
});
$(`#departmentRefreshBtn`).on('click', function() {
console.log('dep');
getDepartments();
});
$(`#locationRefreshBtn`).on('click', function() {
console.log('loc');
getLocations();
});


// successful add
function successfulPopup(action, object){
  $('#success-action').html(action);
  $('#success-object').html(object);

  $('#successAddProfile').modal('show');
  setTimeout(function(){ $('#successAddProfile').modal('hide'); }, 3000);
}

// failed
function failedPopup(action, object){
  $('#failure-action').html(action);
  $('#failure-object').html(object);

  $('#failurePopUp').modal('show');
  setTimeout(function(){ $('#failurePopUp').modal('hide'); }, 3000);
}

//fill location dropdown
function fillLocationList(locationSelectElement) {

    getLocations();

    locationSelectElement.html(' ');

    setTimeout(function() {

        for (var i = 0; i < locationsIdarray.length; i++) {

            var cap = toTitleCase(`${locationsArray[i]}`);

            var option = `<option value="${locationsIdarray[i]}">`+ cap +`</option>`

            locationSelectElement[0].insertAdjacentHTML('beforeend', option);

            console.log('run');
        }
    }, 300);
}

//fill department dropdown
function fillDepartmentList(departmentDropdown) {

    getDepartments();

    departmentDropdown.html(' ');

    setTimeout(function() {

        for (var i = 0; i < departmentsIds.length; i++) {

            var cap = toTitleCase(`${departmentsArray[i]}`);

            var option = `<option value="${departmentsIds[i]}">`+ cap +`</option>`

            departmentDropdown[0].insertAdjacentHTML('beforeend', option);
        }
    }, 300);
}

//first letter to capital
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


//----------------------------------------------------------------------------------Switch between
$('#employee-btn').on('click', function() {
    $('#employee-btn').css('background-color', '#757786');
    $('#department-btn').css('background-color', '#4A4B54');
    $('#location-btn').css('background-color', '#4A4B54');
    $('#departmentTable').hide();
    $('#locationTable').hide();
    $('#employeeTable').show();
    $('#addBtn').attr('data-bs-target', '#addUser');
    $('#employeeRefreshBtn').show();
    $('#departmentRefreshBtn').hide();
    $('#locationRefreshBtn').hide();
    $('#employee-search-bar-container').show();
    $('#department-search-bar-container').show();
    $('#location-search-bar-container').show();
    $('#department-department-searchbar-con').hide();
    $('#department-location-searchbar-con').hide();
    $('#location-location-searchbar-con').hide();
    getAll();
});

$('#department-btn').on('click', function() {
    $('#employee-btn').css('background-color', '#4A4B54');
    $('#department-btn').css('background-color', '#757786');
    $('#location-btn').css('background-color', '#4A4B54');
    $('#employeeTable').hide();
    $('#locationTable').hide();
    $('#departmentTable').show();
    $('#addBtn').attr('data-bs-target', '#addDepartment');
    $('#employeeRefreshBtn').hide();
    $('#departmentRefreshBtn').show();
    $('#locationRefreshBtn').hide();
    $('#employee-search-bar-container').hide();
    $('#department-search-bar-container').hide();
    $('#location-search-bar-container').hide();
    $('#department-department-searchbar-con').show();
    $('#department-location-searchbar-con').show();
    $('#location-location-searchbar-con').hide();
    getDepartments();
});

$('#location-btn').on('click', function() {
    $('#employee-btn').css('background-color', '#4A4B54');
    $('#department-btn').css('background-color', '#4A4B54');
    $('#location-btn').css('background-color', '#757786');
    $('#employeeTable').hide();
    $('#departmentTable').hide();
    $('#locationTable').show();
    $('#addBtn').attr('data-bs-target', '#addLocation');
    $('#employeeRefreshBtn').hide();
    $('#departmentRefreshBtn').hide();
    $('#locationRefreshBtn').show();
    $('#employee-search-bar-container').hide();
    $('#department-search-bar-container').hide();
    $('#location-search-bar-container').hide();
    $('#department-department-searchbar-con').hide();
    $('#department-location-searchbar-con').hide();
    $('#location-location-searchbar-con').show();
    getLocations();
});
