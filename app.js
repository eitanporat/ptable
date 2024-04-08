import diseaseClasses from "./constants.js";

class PeriodicTableApp {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.diseases = []; // This would be populated with AJAX or Fetch API

    this.selectedDiseaseIndex = 0;
    // Initialize the app
    this.init();
  }

  async init() {
    await this.fetchDiseases();
    this.render();
  }

  render() {
    // Clear the container before rendering
    this.container.innerHTML = "";
  
    // Create an outer layout container to hold the settings and the main content
    const outerLayoutContainer = document.createElement("div");
    outerLayoutContainer.className = "outer-layout-container";
  
    // Create the main layout container to hold the disease content
    const layoutContainer = document.createElement("div");
    layoutContainer.className = "layout-container";
  
    // Create a container for settings (e.g., toggle switch)
    const settingsContainer = document.createElement("div");
    settingsContainer.className = "settings-container";
  
    // Container for disease classes and diseases
    const contentContainer = document.createElement("div");
    contentContainer.className = "content-container";
  
    // Append the toggle switch to the settings container
    const toggleSwitch = this.createToggleSwitch();
    settingsContainer.appendChild(toggleSwitch);
  
    // Append the settings container to the outer layout container
    contentContainer.appendChild(settingsContainer);
  
    // Append disease class elements
    const diseaseClassContainer = document.createElement("div");
    diseaseClassContainer.className = "disease-class-container";
    diseaseClasses.forEach((diseaseClass) => {
      diseaseClassContainer.appendChild(
        this.createDiseaseClassElement(diseaseClass)
      );
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
  
    // Append the selected disease container and attributes table to the layout container
    const selectedDiseaseContainer = this.createSelectedDiseaseContainer();
    layoutContainer.appendChild(selectedDiseaseContainer);
  
    // Append the main layout container to the outer layout container
    outerLayoutContainer.appendChild(layoutContainer);
  
    // Append the outer layout container to the main container
    this.container.appendChild(outerLayoutContainer);
  }  

  async fetchDiseases() {
    const response = await fetch("diseases.json");
    this.diseases = await response.json();
  }

  createToggleSwitch() {
    const container = document.createElement("div");
    container.className = "toggle-container";

    const label = document.createElement("label");
    label.className = "switch";

    const input = document.createElement("input");
    input.type = "checkbox";

    const span = document.createElement("span");
    span.className = "slider round";

    const switchLabel = document.createElement("span");
    switchLabel.className = "switch-label";
    switchLabel.textContent = "♀:♂";

    label.appendChild(input);
    label.appendChild(span);

    container.appendChild(label);
    container.appendChild(switchLabel);

    // Event listener for changing the display of disease information
    input.addEventListener("change", () => {
      const diseases = document.querySelectorAll(".disease");
      diseases.forEach((disease) => {
        if (input.checked) {
          disease.classList.add("show-ratio");
        } else {
          disease.classList.remove("show-ratio");
        }
      });
    });

    return container;
  }

  createDiseaseElement(disease, index) {
    const element = document.createElement("div");
    console.log(disease);
    element.className = `disease ${disease.diseaseClass} show-details`; // Initial state
    element.style.backgroundColor = diseaseClasses.find(
      (dc) => dc.disease === disease.diseaseClass
    ).color;

    // Calculate grid position based on row and column properties
    element.style.gridRow = disease.row;
    element.style.gridColumn = disease.column;

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

    // Create and append disease name element
    const diseaseNameElement = document.createElement("div");
    diseaseNameElement.className = "disease-name";
    diseaseNameElement.textContent = disease.diseaseName;
    element.appendChild(diseaseNameElement);

    element.addEventListener("click", () => this.selectDisease(index));

    if (disease.genderRatio)
    {
      const genderRatioText = document.createElement("div");
      genderRatioText.className = "gender-ratio-text";
      genderRatioText.textContent = `♀:♂: ${disease.genderRatio}`;
      element.appendChild(genderRatioText);
    }
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

    const selectedDiseaseContainer = document.querySelector(".selected-disease-container");
    if (selectedDiseaseContainer) {
      selectedDiseaseContainer.innerHTML = "";
      selectedDiseaseContainer.appendChild(this.createSelectedDiseaseElement());
      selectedDiseaseContainer.appendChild(this.createDiseaseAttributesTable());
    }
  }

  createSelectedDiseaseElement() {
    const disease =
      this.selectedDiseaseIndex !== null
        ? this.diseases[this.selectedDiseaseIndex]
        : null;
  
    const element = document.createElement("div");
    element.className = "selected-disease";
  
    if (disease) {
      // Create a container for the scrollable content
      const contentContainer = document.createElement("div");
      contentContainer.className = "selected-disease-content";
  
      // Add organ and cell type information to the content container
      const organNameElement = document.createElement("div");
      organNameElement.className = "organ-name";
      organNameElement.textContent = disease.organ;
      contentContainer.appendChild(organNameElement);
  
      const cellTypeElement = document.createElement("div");
      cellTypeElement.className = "cell-type";
      cellTypeElement.textContent = disease.cellType;
      contentContainer.appendChild(cellTypeElement);
  
      const diseaseNameElement = document.createElement("div");
      diseaseNameElement.className = "disease-name";
      diseaseNameElement.textContent = disease.diseaseName;
      contentContainer.appendChild(diseaseNameElement);
  
      // Apply the same color as the disease class
      const color = diseaseClasses.find(
        (dc) => dc.disease === disease.diseaseClass
      )?.color;
      element.style.backgroundColor = color || "#fff";
  
      element.appendChild(contentContainer);
    } else {
      element.textContent = "No disease selected";
    }
  
    return element;
  }
  
  createDiseaseAttributesTable() {
    const disease =
      this.selectedDiseaseIndex !== null
        ? this.diseases[this.selectedDiseaseIndex]
        : null;
  
    const table = document.createElement("table");
    table.className = "disease-attributes-table";
  
    // // Create table headers
    // const headerRow = table.insertRow();
    // const headerCellName = headerRow.insertCell();
    // headerCellName.textContent = "Attribute";
    // const headerCellValue = headerRow.insertCell();
    // headerCellValue.textContent = "Value";
  
    if (disease) {
      // Add table rows for each attribute
      const attributes = ["countMale", "countFemale", "cellLifeSpan", "incidence", "age", "genderRatio"];
      const attributeToText = {
        "countMale": "Cell Count (Male)",
        "countFemale": "Cell Count (Female)",
        "cellLifeSpan": "Cell Life Span (Hours)",
        "incidence": "Incidence (Per Million)",
        "age": "Age of Onset",
        "genderRatio": "Female/Male Ratio"
      }

      attributes.forEach(attr => {
        const row = table.insertRow();
        const cellName = row.insertCell();
        cellName.textContent = attributeToText[attr];
        const cellValue = row.insertCell();
  
        // Format large numbers in scientific notation
        const value = disease[attr];
        if (typeof value === 'number' && value >= 1e5) {
          cellValue.textContent = value.toExponential(1);
        } else {
          cellValue.textContent = value;
        }
      });
    }
  
    return table;
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
  
    // Append the attributes table for the initially selected disease
    selectedDiseaseContainer.appendChild(this.createDiseaseAttributesTable());
  
    return selectedDiseaseContainer;
  }

}

// Bootstrap the app
document.addEventListener("DOMContentLoaded", () => {
  new PeriodicTableApp("app");
});

// Disable zooming
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

// Disable scrolling
document.addEventListener("touchmove", function (e) {
  e.preventDefault();
});
