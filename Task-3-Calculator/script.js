// Calculator State
let currentDisplay = '0';
let previousDisplay = '';
let operator = null;
let shouldResetDisplay = false;

// DOM Elements
const currentDisplayElement = document.getElementById('current-display');
const previousDisplayElement = document.getElementById('previous-display');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const actionButtons = document.querySelectorAll('[data-action]');

// Initialize Calculator
function init() {
    // Number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => handleNumber(button.dataset.number));
    });

    // Operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => handleOperator(button.dataset.operator));
    });

    // Action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => handleAction(button.dataset.action));
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Handle number input
function handleNumber(number) {
    if (shouldResetDisplay) {
        currentDisplay = '';
        shouldResetDisplay = false;
    }

    // Handle decimal point
    if (number === '.') {
        if (currentDisplay.includes('.')) return;
        if (currentDisplay === '') {
            currentDisplay = '0.';
        } else {
            currentDisplay += '.';
        }
    } else {
        // Handle numbers
        if (currentDisplay === '0') {
            currentDisplay = number;
        } else {
            currentDisplay += number;
        }
    }

    updateDisplay();
}

// Handle operator input
function handleOperator(newOperator) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }

    operator = newOperator;
    previousDisplay = currentDisplay + ' ' + getOperatorSymbol(newOperator);
    shouldResetDisplay = true;

    updateDisplay();
    highlightOperator(newOperator);
}

// Handle action buttons
function handleAction(action) {
    switch (action) {
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
        case 'percent':
            percent();
            break;
        case 'equals':
            calculate();
            break;
    }
}

// Calculate result
function calculate() {
    if (operator === null || shouldResetDisplay) return;

    const prev = parseFloat(previousDisplay);
    const current = parseFloat(currentDisplay);

    if (isNaN(prev) || isNaN(current)) return;

    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Format result
    currentDisplay = formatResult(result);
    previousDisplay = '';
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
    removeOperatorHighlight();
}

// Clear calculator
function clear() {
    currentDisplay = '0';
    previousDisplay = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
    removeOperatorHighlight();
}

// Backspace
function backspace() {
    if (shouldResetDisplay) return;

    if (currentDisplay.length === 1) {
        currentDisplay = '0';
    } else {
        currentDisplay = currentDisplay.slice(0, -1);
    }

    updateDisplay();
}

// Percent
function percent() {
    const current = parseFloat(currentDisplay);
    if (isNaN(current)) return;

    currentDisplay = formatResult(current / 100);
    updateDisplay();
}

// Show error
function showError() {
    currentDisplay = 'Error';
    previousDisplay = 'Cannot divide by zero';
    updateDisplay();
    
    currentDisplayElement.parentElement.classList.add('error-shake');
    setTimeout(() => {
        currentDisplayElement.parentElement.classList.remove('error-shake');
        clear();
    }, 1500);
}

// Format result
function formatResult(result) {
    // Handle very large or very small numbers
    if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
        return result.toExponential(6);
    }

    // Round to avoid floating point errors
    const rounded = Math.round(result * 1e10) / 1e10;
    
    // Convert to string and limit decimal places
    let formatted = rounded.toString();
    
    // Limit total display length
    if (formatted.length > 12) {
        formatted = rounded.toFixed(8);
        // Remove trailing zeros
        formatted = parseFloat(formatted).toString();
    }

    return formatted;
}

// Get operator symbol for display
function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return '';
    }
}

// Update display
function updateDisplay() {
    currentDisplayElement.textContent = currentDisplay;
    previousDisplayElement.textContent = previousDisplay;
}

// Highlight active operator
function highlightOperator(op) {
    removeOperatorHighlight();
    operatorButtons.forEach(button => {
        if (button.dataset.operator === op) {
            button.classList.add('active');
        }
    });
}

// Remove operator highlight
function removeOperatorHighlight() {
    operatorButtons.forEach(button => {
        button.classList.remove('active');
    });
}

// Keyboard support
function handleKeyboard(e) {
    // Numbers and decimal
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleNumber(e.key);
    }
    
    // Operators
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    }
    
    // Enter or Equals
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    
    // Backspace
    if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
    }
    
    // Escape (Clear)
    if (e.key === 'Escape') {
        clear();
    }
    
    // Percent
    if (e.key === '%') {
        percent();
    }
}

// Initialize on page load
init();
