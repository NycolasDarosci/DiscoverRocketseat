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

const transactions = [
    {
        id: '1',
        description: 'Site',
        amount: 500000,
        date: '01/03/2021'
    },
    {
        id: '2',
        description: 'Internet',
        amount: -15000,
        date: '01/03/2021'
    },
    {
        id: '3',
        description: 'Aluguel Apartamento',
        amount: -100000,
        date: '01/03/2021'
    },
]
    
//preciso somar os amounts
//preciso somar os expenses
//fazer a diferença entre amount e expense
//e deles igualar ao total
const Transaction = {

};

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },


    //HTML interno da transação
    //criar atraves dessa funcionalidade que está nesse DOM, innerHTMLTransaction,
    //a substituição desses tbody tr
    innerHTMLTransaction(transaction){
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
                    <img src="assets/minus.svg" alt="Remover Transação">
                </td>
            </tr>
            `    	

        return html
    }
}

const Utils = {
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

transactions.forEach(function(transaction){
  DOM.addTransaction(transaction)  
})