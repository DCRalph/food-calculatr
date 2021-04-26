/* 	------------------------------ Nutrient task ------------------------------
	Author: William Giles
	Date: 21/4/2021
	Description: pParse a file and get the data out and display it nicely
	---------------------------------------------------------------------------
*/	

class foodData{ // class to store all the data
    init(){
        this.foodStore = [] // this is where all the data from the file is stored
        this.ids = []       // indexes of where wanted food items are stored
        this.search = ''    // where the search feild is stored for global access
    }
    add(data){
        this.foodStore.push(data) // adds data to the food store
    }
    get(n){
        return this.foodStore[n] // returns data from a cirten index in food store
    }
    getLength(){
        return this.foodStore.length // returns the lenght of the food store
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var fileExists = false // file uploaded or not

food = new foodData // creates a instance of the foodData class
food.init()         // defines the varibals and sets then to 0

error = document.getElementById('error')

searchForm  = document.getElementById('searchForm')
servingSize = document.getElementById('servingSize')
searchInput = document.getElementById('searchInput')
searchBtn   = document.getElementById('searchBtn')

content     = document.getElementById('content')

fileInput  = document.getElementById('fileInput')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function logE(e){ // logs a error to the console
    console.log('%cOFF there is a error', 'color: #ff0000; font-size: 20px');
    console.log(e);
}

function showE(e){ // shows error to forntend
    setTimeout(function() {
        $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 4000);
    
    error.innerHTML += `<div id="alert" class="alert alert-danger alert-dismissible fade show" role="alert">${e}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
}

function showM(e){ // shows message to forntend
    setTimeout(function() {
        $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 4000);
    
    error.innerHTML += `<div id="alert" class="alert alert-success alert-dismissible fade show" role="alert">${e}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function accurateCalc(num1, operator, num2) { // function to accurately calculate floating point numbers
    /*
        For example 0.1 + 0.2 should = 0.3 but no it is 0.30000000000000004.
        This can lead to some problems so this does magic to fix the problem

    */
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    if (isNaN(num1) || isNaN(num2)) return Number.NaN // check if numbers 
    let strNum1 = num1 + ''
    let strNum2 = num2 + ''
    let dpNum1 = !!(num1 % 1) ? (strNum1.length - strNum1.indexOf('.') - 1) : 0 // Get total decimal places of num1
    let dpNum2 = !!(num2 % 1) ? (strNum2.length - strNum2.indexOf('.') - 1) : 0 // Get total decimal places of num2
    let multiplier = Math.pow(10, dpNum1 > dpNum2 ? dpNum1 : dpNum2) // Compare dpNum1 and dpNum2, then find value of 10 to the power of the largest between them.
    let tempNum1 = Math.round(num1 * multiplier) // Multiply num1 by multiplier to eliminate all decimal places of num1.
    let tempNum2 = Math.round(num2 * multiplier) // Multiply num2 by multiplier to eliminate all decimal places of num2.
    let result
    switch (operator.trim()) {
        case '+':
            result = (tempNum1 + tempNum2) / multiplier;
        break;
        case '-':
            result = (tempNum1 - tempNum2) / multiplier;
        break;
        case '*':
            result = (tempNum1 * tempNum2) / (multiplier * multiplier);
        break;
        case '/':
            result = (tempNum1 / tempNum2);
        break;
        case '%':
            result = (tempNum1 % tempNum2) / multiplier;
        break;
        default:
            result = Number.NaN;
    }
    return result;
}

function readFile(fileIn) { // read file and run data function with the file as a string as a argument
    var file = fileIn.target.files[0]
    if (!file) return

    var reader = new FileReader();
    reader.onload = function(e) { data(e.target.result) }
    reader.readAsText(file)
    fileExists = true
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function data(In){ // convert big long string into a esayly accesable format
    Out = In.split('\n')
    
    for(let i = 1; i < Out.length; i++){ // for loop starts at line 2 bc the first line holds no food data
        try {
            let id = Out[i].split('\t')[0]
            let type = Out[i].split('\t')[1].split(',')[0].replaceAll('"','')
            let fullName = Out[i].split('\t')[1].replaceAll('"','')
            let energy = Out[i].split('\t')[2]
            let protein = Out[i].split('\t')[3]
            let fatTotal = Out[i].split('\t')[4]
            let fatSaturated = Out[i].split('\t')[5]
            let carbohydrate = Out[i].split('\t')[6]
            let sugars = Out[i].split('\t')[7]
            let sodium = Out[i].split('\t')[8]

            food.add({ // adds data to food array
                id: id,
                type: type,
                fullName: fullName,
                energy: energy,
                protein: protein,
                fatTotal: fatTotal,
                fatSaturated:fatSaturated,
                carbohydrate: carbohydrate,
                sugars: sugars,
                sodium: sodium
            })
        } catch (e) {
            logE(e) // catch and log any errors
        }
    }

    // enable search feilds
    servingSize.removeAttribute('disabled')
    searchInput.removeAttribute('disabled')
    searchBtn.removeAttribute('disabled')
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function search(){ // runs when search button is presed
    if(!fileExists){
        showE('No file. Please enter a file.')
        return
    }

    food.search = searchInput.value.toLowerCase() // set search to lowercase then save to class object

    // validate search input

    if(food.search == '69'){
        showM('Nice')
        return
    }
    if(food.search.length < 3){ 
        showE('Not enough letters')
        return
    } 
    if(food.search.includes('<') || food.search.includes('>')){
        showE('No Tom')
        setTimeout(() => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        }, 3000);
        return
    }
    if(food.search == 'tom is awesome'){
        showM('<b>Yes he is!</b>')
        return
    }

    food.ids = [] // reset saved ids

    // find the id that match the searched value
    for(let i = 0; i < food.getLength(); i++){
        if(food.get(i).type.toLowerCase().startsWith(food.search)){
            // console.log(food.get(i));
            food.ids.push(i)
        }
    } 
    render()
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function render(){
    if(food.ids.length < 1) return // check if there is anything to render

    let serving = accurateCalc(servingSize.value, '/', 100)

    content.innerHTML = `<h2>${food.ids.length} results for ${food.search}</h2>` // say how many results found

    for(let i = 0; i < food.ids.length; i++){ // go through each and render it

        // create the info card
        content.innerHTML += `
        <div class="card text-dark text-start bg-light m-3" style="max-width: 24rem;">
            <h4 class="card-header">${food.get(food.ids[i]).fullName}</h4>
            <div class="card-body">
                <div class="row justify-content-center">
                    <div class="col-4"></div>
                    <div class="col text-end">Per serving</div>
                    <div class="col text-end">Per 100g</div>
                </div>
                <hr>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Energy</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).energy, '*', serving)}kJ</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).energy}kJ</p></div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Protein</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).protein, '*', serving)}g</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).protein}g</p></div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Total Fat</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).fatTotal, '*', serving)}g</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).fatTotal}g</p></div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Saturated Fat</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).fatSaturated, '*', serving)}g</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).fatSaturated}g</p></div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Carbohydrate</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).carbohydrate, '*', serving)}g</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).carbohydrate}g</p></div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Sugars</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).sugars, '*', serving)}g</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).sugars}g</p></div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-6"><h5>Sodium</h5></div>
                    <div class="col text-end"><p>${accurateCalc(food.get(food.ids[i]).sodium, '*', serving)}mg</p></div>
                    <div class="col text-end"><p>${food.get(food.ids[i]).sodium}mg</p></div>
                </div>
            </div>
        </div>
        `
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fileInput.addEventListener('change', readFile, false); // when a file is uploaded run readfile function
// servingSize.addEventListener('input', render , false)

searchForm.addEventListener('submit', e => { // run search when form is submited
    e.preventDefault()
    search()
})
