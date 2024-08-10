const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" 
  integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" 
  crossorigin="anonymous" referrerpolicy="no-referrer"
/>
<nav class="navbar is-dark">
  <div class="navbar-brand">
    <a class="navbar-burger" id="burger">
      <span></span>
      <span></span>
      <span></span>
    </a>
  </div>
  <div class="navbar-menu" id="nav-links">
    <div class="navbar-start" id="links">
    </div>
  </div>
</nav>
`;

// YOUR CODE GOES HERE
class CustonNavBar extends HTMLElement{
    constructor(){
        super();

        // Attatch a shadow DOM tree to this instance. This creates a shadow root for us
        this.attachShadow({mode: "open"});

        // Create the span element and add it to the shadow dom
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Store the different pages
        this.pages = [
          {name:"home", href:"index.html", text:"Home"},
          {name:"freePlay", href:"freePlay.html", text:"Free Play"},
          {name:"challenge", href:"challenge.html", text:"Challenge"},
          {name:"documentation", href:"documentation.html", text:"Documentation"},
        ];
    }

    // Watch the 2 data attributes
    static get observedAttributes()
    {
        return ["data-page"];
    }

    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        this.render();
    }

    // Called when the component is added to the page
    connectedCallback(){
      // Make the menu work for mobile
      const burgerIcon = this.shadowRoot.querySelector("#burger");
      const navbarMenu = this.shadowRoot.querySelector("#nav-links");
      burgerIcon.addEventListener('click', () => {
        navbarMenu.classList.toggle('is-active');
      });
    this.render()
    }
    disconnectedCallback(){}

    // A helper method to display the values of the attributes
    render()
    {
      // Get the data of which page this is
      const selectedPage = this.getAttribute('data-page');

      // Where to add the HTML elements
      let html = "";

      // Make the current page not be a clickable link
      for (let page of this.pages)
      {
        if (selectedPage == page.name) // This button is the current page and should be switched to a span
        {
          // Make it a span with bolded text
          html += `
            <span class="navbar-item is-hoverable has-text-weight-bold">
              ${page.text}
            </span>
          `;
        }
        else // It is not the current page and should be a link
        {
          // Make it a clickible link
          html += `
          <a class="navbar-item is-hoverable" href="${page.href}">
            ${page.text}
          </a>
          `;
        }
      }

      // Update the actual HTML
      this.shadowRoot.querySelector("#links").innerHTML = html;
    }
} 

customElements.define('custom-nav-bar', CustonNavBar);