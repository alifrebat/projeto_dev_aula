const inputTime = document.querySelector('#time')
const div_num = document.querySelector('#num_sorteo')
const btn_sorteio = document.querySelector('#btnSortear')

const btn_limpar= document.querySelector('#btnLimpar')

const numsorte = ()=>{
 return Math.floor(Math.random() * 3)
}

btn_sorteio.addEventListener('click',()=>{

    div_num.innerHTML = `${inputTime.value}, ATIVIDADE ${numsorte() + 1}`
})


btn_limpar.addEventListener('click',()=>{
    inputTime.value=''
    div_num.innerHTML = ""
})


console.log(Math.floor(Math.random() *3))