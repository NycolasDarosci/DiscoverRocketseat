const Modal = {

    open(){
        //abrir o modal
        //document- DOM - é o modelo de toda estrutura html passado para o js
        //modelagem do HTML para o JS
        document.querySelector('.modal-overlay')
        //adicionar a classe active sob o modal
        .classList.add('active')
    },

    close(){
        //fechar o modal
        document.querySelector('.modal-overlay')
        //remover a classe active do modal
        .classList.remove('active')  
    }
}
 
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) ||
        []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions))
    }
}
//preciso somar os amounts
//preciso somar os expenses
//fazer a diferença entre amount e expense
//e deles igualar ao total
const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0;
        //pegar todas as transações e para cada transação
        Transaction.all.forEach(transaction =>{
            //se ela foir maior que zero
            if(transaction.amount > 0) {
                //somar income junto com o amount
                income += transaction.amount;
            }
        })

        return income
    },
    expenses(){
        let expense = 0;
        //pegar todas as transações e para cada transação
        Transaction.all.forEach(transaction =>{
            //se ela for menor que zero
            if(transaction.amount < 0) {
                //somar expense junto com o amount
                expense += transaction.amount;
            }
        })

        return expense
    },
    total(){
        return Transaction.incomes() + Transaction.expenses();
    }
};

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },


    //HTML interno da transação
    //criar atraves dessa funcionalidade que está nesse DOM, innerHTMLTransaction,
    //a substituição desses tbody tr
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)
        
        
        //esse é o que estará montando o html, criação do html
        const html =
            ` 
            <tr>
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover Transação">
                </td>
            </tr>
            `    	

        return html
    },

    updateBalance(){
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes());

        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(value){
        value = Number(value) * 100
        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"   
        })
       
        
        return signal + value
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" ||
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos!")
            }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        //verificar se todas as informações foram preenchidas
        try{
            //verificar se todos os campos estão validos
            Form.validateFields()
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            //salvar
            Form.saveTransaction(transaction) 
            //apagar os dados do formulario 
            Form.clearFields()
            //modal fechar e atualizar a aplicação
            Modal.close()
 
        } catch(error){
            alert(error.message)
        }
        
    }


}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
      
          DOM.updateBalance()

          Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()




