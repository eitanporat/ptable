import diseaseColors from "./constants.js";

class PeriodicTableApp {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.diseases = []; // This would be populated with AJAX or Fetch API
    this.diseaseClasses = [
      { disease: "Degenerative", color: "#D9D9D9", row: 1, column: 1 },
      { disease: "Progressive Fibrotic", color: "#97B6D3", row: 2, column: 1 },
      { disease: "Cancer", color: "#9ee5d4", row: 1, column: 2 },
      { disease: "Autoimmune", color: "#D7B1C5", row: 2, column: 2 },
      { disease: "Toxic Adenoma", color: "#B9D4A5", row: 1, column: 3 },
      {
        disease: "Immune Hypersensitivity",
        color: "#EDCD7D",
        row: 2,
        column: 3,
      },
    ];
    this.selectedDiseaseIndex = null;
    // Initialize the app
    this.init();
  }

  async init() {
    await this.fetchDiseases();
    this.render();
  }

  async fetchDiseases() {
    const response = await fetch("diseases.json");
    this.diseases = await response.json();
  }

  createToggleSwitch() {
    const container = document.createElement('div');
    container.className = 'toggle-container';
  
    const label = document.createElement('label');
    label.className = 'switch';
  
    const input = document.createElement('input');
    input.type = 'checkbox';
  
    const span = document.createElement('span');
    span.className = 'slider round';
  
    const switchLabel = document.createElement('span');
    switchLabel.className = 'switch-label';
    switchLabel.textContent = '♂:♀';
  
    label.appendChild(input);
    label.appendChild(span);
  
    container.appendChild(label);
    container.appendChild(switchLabel);
  
    // Event listener for changing the display of disease information
    input.addEventListener('change', () => {
      const diseases = document.querySelectorAll('.disease');
      diseases.forEach((disease) => {
        const diseaseName = disease.querySelector('.disease-name');
        const organName = disease.querySelector('.organ-name');
        const cellType = disease.querySelector('.cell-type');
        const genderRatioText = disease.querySelector('.gender-ratio-text');
  
        if (input.checked) {
          // Transition to show gender ratio
          organName.style.display = 'none';
          cellType.style.display = 'none';
          diseaseName.style.display = 'block'; // Ensure disease name is always shown
          genderRatioText.style.display = 'block'; // Remove display none to start transition
          setTimeout(() => {
            disease.classList.add('show-ratio');
          }, 0); // Timeout to ensure display is set before adding class
        } else {
          // Transition to show full details
          disease.classList.remove('show-ratio');
          // Set timeout to apply display block after transition ends
          setTimeout(() => {
            organName.style.display = 'block';
            cellType.style.display = 'block';
            genderRatioText.style.display = 'none'; // Hide after transition
          }, 300); // This should be the same duration as the transition
        }
      });
    });
  
    return container;
  }
  
  createDiseaseElement(disease, index) {
    const element = document.createElement("div");
    element.className = `disease ${disease.diseaseClass} show-details`; // Initial state
        element.style.backgroundColor = this.diseaseClasses.find(
      (dc) => dc.disease === disease.diseaseClass
    ).color;

    // Calculate grid position based on row and column properties
    element.style.gridRow = disease.row;
    element.style.gridColumn = disease.column;

    // Create and append disease name element
    const diseaseNameElement = document.createElement("div");
    diseaseNameElement.className = "disease-name";
    diseaseNameElement.textContent = disease.diseaseName;
    element.appendChild(diseaseNameElement);
    
    // Create and append organ name element
    const organNameElement = document.createElement("div");
    organNameElement.className = "organ-name";
    organNameElement.textContent = disease.organ;
    element.appendChild(organNameElement);

    // Create and append cell type element
    const cellTypeElement = document.createElement("div");
    cellTypeElement.className = "cell-type";
    cellTypeElement.textContent = disease.cellType;
    element.appendChild(cellTypeElement);

    element.addEventListener("click", () => this.selectDisease(index));

    const genderRatioText = document.createElement("div");
    genderRatioText.className = "gender-ratio-text";
    genderRatioText.textContent = `M/F: ${disease.genderRatio}`;
    element.appendChild(genderRatioText);
    
    return element;
  }

  createDiseaseClassElement(diseaseClass) {
    const container = document.createElement("div");
    container.className = "disease-class";

    // Create the color box
    const colorBox = document.createElement("div");
    colorBox.className = "disease-class-color-box";
    colorBox.style.backgroundColor = diseaseClass.color; // Set the background color to match the disease class

    // Create the label
    const label = document.createElement("span");
    label.className = "disease-class-label";
    label.textContent = diseaseClass.disease;
  
    // Append the color box and label to the container
    container.appendChild(colorBox);
    container.appendChild(label);

    container.addEventListener("mouseenter", () =>
      this.highlightDiseases(diseaseClass.disease)
    );
    container.addEventListener("mouseleave", () => this.resetHighlight());

    // Use touch events for mobile hover effect
    container.addEventListener("touchstart", (event) => {
      this.highlightDiseases(diseaseClass.disease);
      event.preventDefault(); // Prevent default touch behavior
    });

    container.addEventListener("touchend", (event) => {
      this.resetHighlight();
      event.preventDefault(); // Prevent default touch behavior
    });

    return container;
  }

  selectDisease(index) {
    this.selectedDiseaseIndex = index;
  
    // Update only the selected disease container with new content
    const selectedDiseaseContainer = document.querySelector(".selected-disease-container");
    if (selectedDiseaseContainer) {
      // Clear the container and append the updated selected disease element
      selectedDiseaseContainer.innerHTML = "";
      selectedDiseaseContainer.appendChild(this.createSelectedDiseaseElement());
    }
  }
  

  createSelectedDiseaseElement() {
    const disease =
      this.selectedDiseaseIndex !== null
        ? this.diseases[this.selectedDiseaseIndex]
        : null;

    const element = document.createElement("div");
    element.className = "selected-disease"; // Change class to match the selected disease panel styling

    if (disease) {
      // Create a container for the scrollable content
      const contentContainer = document.createElement("div");
      contentContainer.className = "selected-disease-content";
      element.appendChild(contentContainer);

      const diseaseNameElement = document.createElement("div");
      diseaseNameElement.className = "disease-name";
      diseaseNameElement.textContent = disease.diseaseName;
      contentContainer.appendChild(diseaseNameElement);

      // Add organ and cell type information to the content container
      const organNameElement = document.createElement("div");
      organNameElement.className = "organ-name";
      organNameElement.textContent = disease.organ;
      contentContainer.appendChild(organNameElement);

      const cellTypeElement = document.createElement("div");
      cellTypeElement.className = "cell-type";
      cellTypeElement.textContent = disease.cellType;
      contentContainer.appendChild(cellTypeElement);

      // Apply the same color as the disease class
      const color = this.diseaseClasses.find(
        (dc) => dc.disease === disease.diseaseClass
      )?.color;
      element.style.backgroundColor = color || "#fff";
    } else {
      element.textContent = "No disease selected";
    }

    return element;
  }

  highlightDiseases(diseaseClass) {
    this.diseases.forEach((disease, index) => {
      const diseaseElement = this.container.querySelector(
        `.disease:nth-child(${index + 1})`
      );
      if (disease.diseaseClass !== diseaseClass) {
        diseaseElement.classList.add("dimmed");
      }
    });
  }

  resetHighlight() {
    const diseaseElements = this.container.querySelectorAll(".disease");
    diseaseElements.forEach((element) => element.classList.remove("dimmed"));
  }
  // Function to create the selected disease container
  createSelectedDiseaseContainer() {
    const selectedDiseaseContainer = document.createElement("div");
    selectedDiseaseContainer.className = "selected-disease-container";
    selectedDiseaseContainer.appendChild(this.createSelectedDiseaseElement());
    selectedDiseaseContainer.classList.add("selected-disease-panel"); // Add the class for specific styling
    return selectedDiseaseContainer;
  }

  render() {
    // Clear the container before rendering
    this.container.innerHTML = "";
  
    // Create an outer layout container to hold the settings and the main content
    const outerLayoutContainer = document.createElement("div");
    outerLayoutContainer.className = "outer-layout-container";
  
    // Create a container for settings (e.g., toggle switch)
    const settingsContainer = document.createElement("div");
    settingsContainer.className = "settings-container";
  
    // Append the toggle switch to the settings container
    const toggleSwitch = this.createToggleSwitch();
    settingsContainer.appendChild(toggleSwitch);
  
    // Append the settings container to the outer layout container
    outerLayoutContainer.appendChild(settingsContainer);
  
    // Create the main layout container to hold the disease content
    const layoutContainer = document.createElement("div");
    layoutContainer.className = "layout-container";
  
    // Container for disease classes and diseases
    const contentContainer = document.createElement("div");
    contentContainer.className = "content-container";
  
    // Append disease class elements
    const diseaseClassContainer = document.createElement("div");
    diseaseClassContainer.className = "disease-class-container";
    this.diseaseClasses.forEach((diseaseClass) => {
      diseaseClassContainer.appendChild(this.createDiseaseClassElement(diseaseClass));
    });
    contentContainer.appendChild(diseaseClassContainer);
  
    // Append disease elements
    const diseasesContainer = document.createElement("div");
    diseasesContainer.className = "diseases-container";
    this.diseases.forEach((disease, index) => {
      diseasesContainer.appendChild(this.createDiseaseElement(disease, index));
    });
    contentContainer.appendChild(diseasesContainer);
  
    // Append the content container to the layout container
    layoutContainer.appendChild(contentContainer);
  
    // Append the selected disease container to the layout container
    const selectedDiseaseContainer = this.createSelectedDiseaseContainer();
    layoutContainer.appendChild(selectedDiseaseContainer);
  
    // Append the main layout container to the outer layout container
    outerLayoutContainer.appendChild(layoutContainer);
  
    // Append the outer layout container to the main container
    this.container.appendChild(outerLayoutContainer);
  }
  

}

// Bootstrap the app
document.addEventListener("DOMContentLoaded", () => {
  new PeriodicTableApp("app");
});

// Disable zooming
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

// Disable scrolling
document.addEventListener('touchmove', function (e) {
  e.preventDefault();
});

document.body.style.overflow = 'hidden';
