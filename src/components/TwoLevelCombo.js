export class TwoLevelCombo extends HTMLElement {
    get value() {
        const select = this.querySelector('select');
        return parseInt(select.value);
    }
    connectedCallback() {
        this.innerHTML = `<select></select>`;
        const select = this.querySelector('select');
        select.addEventListener('change', (e) => {
            this.dispatchEvent(
                new CustomEvent('select', {
                    detail: {
                        value: parseInt(e.target.value)
                    }
                })
            );
        });
    }

    addData(data, propertyName) {
        const select = this.querySelector('select');
        select.innerHTML = '';
        data.forEach((group) => {
            const optGroup = document.createElement('optgroup');
            optGroup.label = group.name;
            group.options.forEach((item) => {
                const option = document.createElement('option');
                option.value = item.id;
                option.innerText = item[propertyName];
                optGroup.appendChild(option);
            });
            select.appendChild(optGroup);
        });
    }
}
