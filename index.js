const formData = [
    {
      "id": "c0ac49c5-871e-4c72-a878-251de465e6b4",
      "type": "input",
      "label": "Sample Label",
      "placeholder": "Sample placeholder"
    },
    {
      "id": "146e69c2-1630-4a27-9d0b-f09e463a66e4",
      "type": "select",
      "label": "Sample Label",
      "options": ["Sample Option", "Sample Option", "Sample Option"]
    },
  ];

  const formPreview = document.getElementById('formPreview');

  formData.forEach(field => {
    const element = createElement(field);
    formPreview.appendChild(element);
  });


  function createElement(field) {
    const container = document.createElement('div');
    container.id = field.id;
    container.classList.add('form-field');
    container.draggable = true;

    const label = document.createElement('label');
    label.textContent = field.label;
    container.appendChild(label);

    const fieldElement = document.createElement(field.type);
    if (field.type === 'input' || field.type === 'textarea') {
        fieldElement.setAttribute('placeholder', field.placeholder);
    } else if (field.type === 'select') {
        const defaultOption = document.createElement('option');
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.textContent = 'Select an option';
        fieldElement.appendChild(defaultOption);
        field.options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            fieldElement.appendChild(option);
        });
    }

    container.appendChild(fieldElement);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Using trash-alt icon
    deleteButton.addEventListener('click', () => {
        deleteField(field.id);
    });

    container.appendChild(deleteButton);

    // Add drag-and-drop event listeners
    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragend', handleDragEnd);

    return container;
}


  document.getElementById('addInput').addEventListener('click', () => {
    const newField = {
      "id": uuidv4(),
      "type": "input",
      "label": "New Input",
      "placeholder": "New Placeholder"
    };
    const element = createElement(newField);
    formPreview.appendChild(element);
  });

  document.getElementById('addSelect').addEventListener('click', () => {
    const newField = {
      "id": uuidv4(),
      "type": "select",
      "label": "New Select",
      "options": ["Option 1", "Option 2", "Option 3"]
    };
    const element = createElement(newField);
    formPreview.appendChild(element);
  });

  document.getElementById('addTextarea').addEventListener('click', () => {
    const newField = {
      "id": uuidv4(),
      "type": "textarea",
      "label": "New Textarea",
      "placeholder": "New Placeholder"
    };
    const element = createElement(newField);
    formPreview.appendChild(element);
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const formElements = formPreview.children;
    const formData = [];
    let isValid = true;

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i].querySelector('input, select, textarea');
      const fieldType = element.nodeName.toLowerCase();
      const fieldData = {
        id: formElements[i].id,
        type: fieldType,
        label: formElements[i].querySelector('label').textContent,
      };

      if (fieldType === 'input' || fieldType === 'textarea') {
        const fieldValue = element.value.trim();
      
        fieldData.placeholder = element.getAttribute('placeholder');
        fieldData.value = fieldValue;
      } else if (fieldType === 'select') {
        const selectedOption = element.value;

        fieldData.options = [];
        const options = element.querySelectorAll('option');
        options.forEach(option => {
          if (!option.disabled) {
            fieldData.options.push(option.textContent);
          }
        });
        fieldData.value = selectedOption;
      }

      formData.push(fieldData);
    }

    if (isValid) {
      console.log(formData);
      // If all fields are valid, proceed with form submission or further processing
    }
  });

  // Function to delete field
  function deleteField(id) {
    const elementToRemove = document.getElementById(id);
    elementToRemove.parentNode.removeChild(elementToRemove);
  }

  // Function to generate UUID
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  let dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    this.classList.add('dragging');
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); 
    }
    if (dragSrcEl !== this) {
      this.parentNode.removeChild(dragSrcEl);
      const dropHTML = e.dataTransfer.getData('text/html');
      this.insertAdjacentHTML('beforebegin',dropHTML);
      const dropElem = this.previousSibling;
      dropElem.addEventListener('dragstart', handleDragStart);
      dropElem.addEventListener('dragover', handleDragOver);
      dropElem.addEventListener('dragenter', handleDragEnter);
      dropElem.addEventListener('dragleave', handleDragLeave);
      dropElem.addEventListener('drop', handleDrop);
      dropElem.addEventListener('dragend', handleDragEnd);
    }
    return false;
  }

  function handleDragEnd(e) {
    this.classList.remove('over');
    this.classList.remove('dragging');
  }

  const draggableElements = document.querySelectorAll('.form-field');
  [].forEach.call(draggableElements, function(field) {
    field.addEventListener('dragstart', handleDragStart);
    field.addEventListener('dragover', handleDragOver);
    field.addEventListener('dragenter', handleDragEnter);
    field.addEventListener('dragleave', handleDragLeave);
    field.addEventListener('drop', handleDrop);
    field.addEventListener('dragend', handleDragEnd);
  });
