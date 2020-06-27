var html = 
`
<div class = 'stock-view-date'>
            <h4>Select date for viewing past stock suggestions : </h4>
            <input type="date" name="stock-view-date" id="stock-view-date">
        </div>
        <div class = "stock-display-para">
            <strong style="text-decoration: underline;">EDITOR'S NOTE :</strong>
            <br><br><p class = "para1" style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam odio saepe quo, animi dolorum neque voluptatem pariatur dicta numquam, hic assumenda cum dignissimos aut praesentium id inventore! Voluptates, nam incidunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus iure odio numquam, vero, deleniti illo ipsam harum facere similique nostrum quas. Modi debitis, provident commodi maiores iusto neque magni ipsa.</p>
            <p class = "para1" style="text-align: justify;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima iste corrupti quia laudantium eos, nisi eligendi molestiae illum necessitatibus, exercitationem voluptatem, odio animi ea cumque ipsam mollitia voluptas consectetur libero. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam ullam incidunt earum sequi quo maxime qui libero ex, molestiae unde debitis, sapiente nemo quia eius fugiat voluptatem, velit minus inventore.</p><br><br>
        </div>
        <div class = "stock-display">
            <strong class = "stock-display-headers">Stock Name</strong>
            <strong class = "stock-display-headers">Buy above</strong>
            <strong class = "stock-display-headers">Target</strong>
            <strong class = "stock-display-headers">Stop Loss</strong>
            <strong class = "stock-display-headers">Current Price</strong>
            <strong class = "stock-display-headers">Recent High</strong>
            <strong class = "stock-display-headers">Recent Low</strong>
            <strong class = "stock-display-headers">Remarks</strong>

            <h8 class = "stock-display-items">Infosys</h8>
            <h8 class = "stock-display-items">500</h8>
            <h8 class = "stock-display-items">700</h8>
            <h8 class = "stock-display-items">20</h8>
            <h8 class = "stock-display-items">480</h8>
            <h8 class = "stock-display-items">900</h8>
            <h8 class = "stock-display-items">450</h8>
            <h8 class = "stock-display-items">Good</h8>
            

        </div>
`


document.querySelector('.stock-display .stock-display-items .cut').addEventListener('click', ()=>{
    console.log( "Bye")
    document.querySelector( '.stock-display-items' ).parentNode.removeChild(document.querySelector( '.stock-display-items' ))
})