
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetNextInput = false;
    }
    
    delete() {
        if (this.resetNextInput) return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }
    
    appendNumber(number) {
        if (this.resetNextInput) {
            this.currentOperand = '0';
            this.resetNextInput = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.resetNextInput = true;
    }
    
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetNextInput = true;
    }
    
    percent() {
        if (this.currentOperand === '0') return;
        const current = parseFloat(this.currentOperand);
        this.currentOperand = (current / 100).toString();
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = this.previousOperand;
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);
    
    // Event listeners for number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
            calculator.updateDisplay();
        });
    });
    
    // Event listeners for operation buttons
    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.dataset.operation);
            calculator.updateDisplay();
        });
    });
    
    // Equals button
    document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
        calculator.calculate();
        calculator.updateDisplay();
    });
    
    // Clear button
    document.querySelector('[data-action="clear"]').addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });
    
    // Delete button
    document.querySelector('[data-action="delete"]').addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });
    
    // Percent button
    document.querySelector('[data-action="percent"]').addEventListener('click', () => {
        calculator.percent();
        calculator.updateDisplay();
    });
    
    // Keyboard support
    document.addEventListener('keydown', event => {
        if (event.key >= '0' && event.key <= '9') {
            calculator.appendNumber(event.key);
            calculator.updateDisplay();
        }
        if (event.key === '.') {
            calculator.appendNumber('.');
            calculator.updateDisplay();
        }
        if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            let operation;
            switch (event.key) {
                case '+': operation = '+'; break;
                case '-': operation = '−'; break;
                case '*': operation = '×'; break;
                case '/': operation = '÷'; break;
            }
            calculator.chooseOperation(operation);
            calculator.updateDisplay();
        }
        if (event.key === 'Enter' || event.key === '=') {
            calculator.calculate();
            calculator.updateDisplay();
        }
        if (event.key === 'Escape') {
            calculator.clear();
            calculator.updateDisplay();
        }
        if (event.key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
        if (event.key === '%') {
            calculator.percent();
            calculator.updateDisplay();
        }
    });
});