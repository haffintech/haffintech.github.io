/*
    -> TODO: visualize selection and mergeSort
    -> TODO: build a switch to select between one visualization and a comparison between two algos
*/

var lengthOfArrays;
var numbersLeft;
var numbersRight;

var rightComparedIndex1 = [];
var rightComparedIndex2 = [];
var leftComparedIndex1 = [];
var leftComparedIndex2 = [];
var leftIsSwapped = [];
var rightIsSwapped = [];
var sorting1 = "";
var sorting2 = "";
var delay = 1200; // in milliseconds, used for visualization

$(document).ready(function() {
    $('#slider').change(function () {
        alert("this site is a work in progress. Check out in a couple of days again to see what changed! :)");
        onSliderChange();
    });
});


function onSliderChange() {
    
    //reset all bars and arrays where animations are stored
    $('.bars').remove();
    rightComparedIndex1 = [];
    rightComparedIndex2 = [];
    leftComparedIndex1 = [];
    leftComparedIndex2 = [];
    leftIsSwapped = [];
    rightIsSwapped = [];

    let value = parseInt($('#slider').val());
    var numbers = new Array(value);
    lengthOfArrays = value;
    initNumbers(numbers);
    numbersLeft = [...numbers];
    numbersRight = [...numbers];
    if(value > 20){
        delay = 300/value;
    }
}


function initNumbers(numbers) {
    for(i = 0; i < numbers.length; i++){
        numbers[i] = Math.round(Math.random() * 300) + 5;
        createBar(numbers[i], '#leftSide', i);
        createBar(numbers[i], '#rightSide', i);
        
    }
}


function createBar(value, whichSide, index) {
    
    var sideAdditionInID;

    if(whichSide == "#leftSide"){
        sideAdditionInID = "l";
    }
    else {
        sideAdditionInID = "r";
    }
    let newdiv = $(document.createElement('div'));
    newdiv.addClass('bars');
    newdiv.addClass('bar' + index);
    newdiv.attr('id', 'bar' + index + sideAdditionInID);
    newdiv.css('width', value/4 + '%');
    newdiv.css('height', Math.pow(70 / lengthOfArrays, 1.1) + '%');
    $(whichSide).append(newdiv);
    
}

function selectAlgos(id) {
    // reset selection
    if(sorting2 != "") {
        $("#" + sorting1).css("background-color", "#4a4");
        $("#" + sorting2).css("background-color", "#4a4");
        sorting1 = "";
        sorting2 = "";
    }
    if(sorting1 == ""){
        sorting1 = id;
        $("#" + id).css("background-color", "orange");
    }
    else {
        sorting2 = id;
        $("#" + id).css("background-color", "lightblue");
    }
}


function startSorting() {
    var numbers;

    sorting = [sorting1, sorting2];
    
    for(var i = 0; i < 2; i++){
        if(i == 0){
            numbers = numbersLeft;
        }
        else if( i == 1) {
            numbers = numbersRight;
        }
        switch (sorting[i]) {
            case "selection":
                selectionSort(numbers);
                break;
            case "insert": 
                insertSort(numbers);
                break;
        
            case "bubble":
                bubbleSort(numbers);
                break;
            case "quick":
                quickSort(numbers, 0, numbers.length-1);
                break;
            case "merge":
                mergeSort(numbers, 0, numbers.length-1);
                break;
            case "heap":
                heapSort(numbers);
                break;
            default:
                break;
        }
        if(sorting[i] != "selection"){ // needs its own visualization
            visualizeAlgorithm(sorting[i]);
        }
    }
}


function visualizeAlgorithm(algorithm) {
    var initialColor;
    var sideAdditionInID;
    var isSwapped;
    

    if(algorithm == sorting1){
        comparedIndex1 = leftComparedIndex1;
        comparedIndex2 = leftComparedIndex2;
        isSwapped = leftIsSwapped;
        sideAdditionInID = "l";
        initialColor = "orange";
    }
    else if(algorithm == sorting2){
        comparedIndex1 = rightComparedIndex1;
        comparedIndex2 = rightComparedIndex2;
        isSwapped = rightIsSwapped;
        sideAdditionInID = "r";
        initialColor = "lightblue";
    }
    else {
        return;
    }

    
    if(comparedIndex1.length != comparedIndex2.length){
        return;
    }
    

    for(let i = 0; i <= (comparedIndex1.length-1)*3; i+=3){
        index1 = comparedIndex1[Math.floor(i/3)];
        index2 = comparedIndex2[Math.floor(i/3)];

        // divs that have to be swapped visually
        let div1 = $('#bar' + index1 + sideAdditionInID);
        let div2 = $('#bar' + index2 + sideAdditionInID);
        
        // mark both blue to visualize comparing
        setTimeout( () => {
            div1.css("background-color", "midnightblue");
            div2.css("background-color", "midnightblue");
        }, i*delay);
        
        // swap them by changing their size, then mark green to visualize swap
        // 

        setTimeout( () => {
            if(isSwapped[Math.floor(i/3)]){
                width1 = div1.width();
                width2 = div2.width();
                div1.width(width2);
                div2.width(width1);
                div1.css("background-color", "green");
                div2.css("background-color", "green");
            }
        }, (i+1)*delay);

        // reset color   
        setTimeout( () => {
            div1.css("background-color", initialColor);
            div2.css("background-color", initialColor);
        }, (i+2)*delay);
        
    }

    

}


function saveComparedDivs(index1, index2, algorithm) {
    if(algorithm == sorting1){
        leftComparedIndex1.push(index1);
        leftComparedIndex2.push(index2);    
    }
    else if(algorithm == sorting2){
        rightComparedIndex1.push(index1);
        rightComparedIndex2.push(index2);
    }
}

function saveIfSwapped(wasSwapped, algorithm){
    if(algorithm == sorting1){
        leftIsSwapped.push(wasSwapped);
    }
    else if(algorithm == sorting2){
        rightIsSwapped.push(wasSwapped);
    }
}


// all sorting algorithms

function insertSort(numbers){
    var temp;
    for(i = 1; i < numbers.length; i++){
        let j = i;

        while(j > 0 && numbers[j] < numbers[j-1]){
            saveComparedDivs(j, j-1, "insert");
            saveIfSwapped(true, "insert");
            temp = numbers[j];
            numbers[j] = numbers[j-1];
            numbers[--j] = temp;   
        }
        if(j > 0){
            saveComparedDivs(j, j-1, "insert");
            saveIfSwapped(false, "insert");
        }
    }
    
}


function bubbleSort(numbers) {
    var temp;
    for(i = numbers.length-1; i >= 0; i--){
        for(j = 0; j < i; j++){

            
            if(numbers[j] > numbers[j+1]){
                saveComparedDivs(j, j+1, "bubble");
                saveIfSwapped(true, "bubble");

                temp = numbers[j];
                numbers[j] = numbers[j+1];
                numbers[j+1] = temp;
                
            }
            else {
                saveComparedDivs(j, j+1, "bubble");
                saveIfSwapped(false, "bubble");
            }
        }
    }
    
}


function quickSort(numbers, first, last) {
    var i, j, pivot;
    var temp;

    
    if(first < last) {
        pivot = first;
        i = first;
        j = last;
        
        while(i < j){
            while(numbers[i] <= numbers[pivot] && i < last){
                saveComparedDivs(i, pivot, "quick");
                saveIfSwapped(false, "quick");
                i++;
            }

            while(numbers[j] > numbers[pivot]){
                saveComparedDivs(j, pivot, "quick");
                saveIfSwapped(false, "quick");
                j--;
            }
            if(i < j) {
                temp = numbers[i];
                numbers[i] = numbers[j];
                numbers[j] = temp;
                saveComparedDivs(i, j, "quick");
                saveIfSwapped(true, "quick");
            }
        }
        saveComparedDivs(pivot, j, "quick");
        saveIfSwapped(true, "quick");
        temp = numbers[pivot];
        numbers[pivot] = numbers[j];
        numbers[j] = temp;
        
        quickSort(numbers, first, j-1);
        quickSort(numbers, j+1, last);
    }
}

//TODO: Animation probably has to be unique for mergesort!
function mergeSort(numbers, leftIndex, rightIndex) {

    if(leftIndex < rightIndex){
        var mid = Math.floor((leftIndex+rightIndex)/2);
        mergeSort(numbers, leftIndex, mid);
        mergeSort(numbers, mid+1, rightIndex);
        merge(numbers, leftIndex, mid+1, rightIndex);
    }
}

function merge(numbers, leftStart, rightStart, end) {
    var mid = rightStart-1;
    var temp;
    while(leftStart <= mid && rightStart <= end){
        
        if(numbers[leftStart] <= numbers[rightStart]){
            leftStart++;
            saveComparedDivs(leftStart, rightStart, "merge");
            saveIfSwapped(false, "merge");
        }
        else {
            temp = numbers[rightStart];
            currentIndex = rightStart;
            while(currentIndex >= leftStart){
                //saveComparedDivs(currentIndex, currentIndex-1, "merge");
                //saveIfSwapped(true, "merge");

                numbers[currentIndex] = numbers[currentIndex-1];
                currentIndex--;
            }
            saveComparedDivs(leftStart, leftStart+1, "merge");
            saveIfSwapped(true, "merge");
            numbers[leftStart] = temp;
            leftStart++;
            mid++;
            rightStart++;
        }

    }
}

function heapSort(numbers) {
    
    var size = numbers.length;
    var temp;
    
    for(let i = Math.floor(size/2 - 1); i >= 0; i--){
        heapify(numbers, size, i);
    }

    for(let i = size - 1; i > 0; i--) {
        saveComparedDivs(i, 0, "heap");
        saveIfSwapped(true, "heap");
        temp = numbers[0];
        numbers[0] = numbers[i];
        numbers[i] = temp;
        
        heapify(numbers, i, 0);
    }

}

function heapify(numbers, size, node) {
    var leftChild = 2*node+1;
    var rightChild = 2*node+2;
    var largest = node;
    var temp;

    if(leftChild < size && numbers[leftChild] > numbers[largest]){
        largest = leftChild;
    }

    if(rightChild < size && numbers[rightChild] > numbers[largest]) {
        largest = rightChild;
    }

    if(largest != node) {
        saveComparedDivs(largest, node, "heap");
        saveIfSwapped(true, "heap");
        temp = numbers[node];
        numbers[node] = numbers[largest];
        numbers[largest] = temp;
        heapify(numbers, size, largest);
    }
}


function selectionSort(numbers) {

    var isNewMinOrSwapped = []; 
    /* 
    the array above contains values from 0-2. 
    0 marks corresponding comparison as "nothing changed", 
    1 marks that the comparison led to new minimum,
    2 states that it is actually a swap and not a comparison 
    */
    var comparedIndizes1 = [];
    var comparedIndizes2 = [];
    var min;
    var temp;

    for(i = 0; i < numbers.length; i++) {
        min = i;
        comparedIndizes1.push(min);
        comparedIndizes2.push(min);
        isNewMinOrSwapped.push(1);
        for(j = i+1; j < numbers.length; j++){
            
            comparedIndizes1.push(min);
            comparedIndizes2.push(j);
        
            if(numbers[min] > numbers[j]) {
                min = j;
                isNewMinOrSwapped.push(1);
            }
            else {
                isNewMinOrSwapped.push(0);
            }
        }
        comparedIndizes1.push(min);
        comparedIndizes2.push(i);
        isNewMinOrSwapped.push(2);
        temp = numbers[min];
        numbers[min] = numbers[i];
        numbers[i] = temp;
    }

    visualizeSelectionSort(comparedIndizes1, comparedIndizes2, isNewMinOrSwapped);
}

function visualizeSelectionSort(comparedIndizes1, comparedIndizes2, isNewMinOrSwapped) {

    var initialColor;
    var sideAdditionInID;    

    if("selection" == sorting1){
        sideAdditionInID = "l";
        initialColor = "orange";
    }
    else if("selection" == sorting2){
        sideAdditionInID = "r";
        initialColor = "lightblue";
    }
    else {
        return;
    }

    
    if(comparedIndizes1.length != comparedIndizes2.length){
        return;
    }


    for(let i = 0; i <= (comparedIndizes1.length-1)*3; i+=3){
        index1 = comparedIndizes1[Math.floor(i/3)];
        index2 = comparedIndizes2[Math.floor(i/3)];

        // divs that have to be swapped visually
        let div1 = $('#bar' + index1 + sideAdditionInID);
        let div2 = $('#bar' + index2 + sideAdditionInID);
        
        // mark both blue to visualize comparing
        setTimeout( () => {
            div1.css("background-color", "midnightblue");
            div2.css("background-color", "midnightblue");
        }, i*delay);

        setTimeout( () => {
            if(isNewMinOrSwapped[Math.floor(i/3)] == 2){
                width1 = div1.width();
                width2 = div2.width();
                div1.width(width2);
                div2.width(width1);
                div1.css("background-color", "green");
                div2.css("background-color", "green");
            }
            else if(isNewMinOrSwapped[Math.floor(i/3)] == 1){
                div2.css("background-color", "pink"); // mark new min
            }
        }, (i+1)*delay);

        // reset color   
        setTimeout( () => {
            div1.css("background-color", initialColor);
            div2.css("background-color", initialColor);
        }, (i+2)*delay);
        
    }
}
