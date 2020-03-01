(function () {
    /*
     * Start com as informações iniciais para montar as TR
     * Está informações poderam vir de um arquivo ou BD
     * Neste momento elas estão vindo do localStore
    */

    const elForm = document.querySelector('form');
    const elTbody = document.querySelector('tbody');
    const elMessage = document.querySelector('#message');
    var elButtonSaveEdit = document.querySelector('#btnEditModal');

    var itens = localStorage.length;
    var tbLocalStorage = [];

    for (var i = 0; i < itens; i++) {
        tbLocalStorage = localStorage.getItem(localStorage.key(i));
        assembleNameList(JSON.parse(tbLocalStorage), buttons(localStorage.key(i)));
    }

    elForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var name = document.querySelector('#name').value;
        var surName = document.querySelector('#surName').value;
        var nickName = document.querySelector('#nickName').value;

        var id = generateId();
        
        var newInclude = checkInclude(id, nickName);
        console.log(newInclude);
        
        if (newInclude['checkNickName']){
            messageEvent('alert alert-warning alert-dismissible fade show', 'Alerta Nick Name Duplicado!', `O nome ${name} ${surName}, não foi salvo, tanto na TR como no Local Storage.`);
        } else {    
            var item = newInclude['id'];

            var data = {
                "id": newInclude['id'],
                "name": name,
                "surName": surName,
                "nickName": nickName
            };

            saveLocalStorage(item, data);
            messageEvent('alert alert-success alert-dismissible fade show', 'Salvo com Sucesso!', `O nome ${data['name']} ${data['surName']}, foi salvo, tanto na TR como no Local Storage.`);
        }

    });


    elButtonSaveEdit.addEventListener("click", function () {
        var newId = document.querySelector('#idModal').value;

        var datas = {
            "id": newId,
            "name": document.querySelector('#nameModal').value,
            "surName": document.querySelector('#surNameModal').value,
            "nickName": document.querySelector('#nickNameModal').value
        }

        updateLocalStorage(newId, datas);

        $('#editTr').modal('hide');

    });

    function saveLocalStorage(item, data) {
        var saveData = [];
        saveData.push(data);
        localStorage.setItem(item, JSON.stringify(saveData));
        assembleNameList(saveData, buttons(item));
    };

    function updateLocalStorage(item, data) {
        var elTrEditSave = actionSelect(item);
        elTrEditSave.remove();

        assembleNameList(data, buttons(item));

        localStorage.removeItem(item);
        localStorage.setItem(item, JSON.stringify(data));
        messageEvent('alert alert-primary alert-dismissible fade show', 'Alterado com Sucesso!', `O nome ${data['name']} ${data['surName']}, está alterado, tanto na TR como no Local Storage.`);
    }

    function messageEvent(type, h4Message, message) {
        
        var elDivMessage = document.createElement('div');
        var elHrMessage = document.createElement('hr');
        var elH4Message = document.createElement('h4');
        var elPMessage = document.createElement('p');

        var txtH4Message = document.createTextNode(h4Message);
        var txtPMessage = document.createTextNode(message);

        elDivMessage.setAttribute('class', type);
        elDivMessage.setAttribute('role', 'alert');

        elH4Message.appendChild(txtH4Message);
        elPMessage.appendChild(txtPMessage);

        elDivMessage.appendChild(elH4Message);
        elDivMessage.appendChild(elHrMessage);
        elDivMessage.appendChild(elPMessage);
        
        elMessage.appendChild(elDivMessage);

        setTimeout(() => {
            elMessage.removeChild(elDivMessage);
        }, 3000);

    }

    function removeLocalStorage(id) {
        var elTrRemove = actionSelect(id);

        elTrRemove.remove();
        localStorage.removeItem(id);
        messageEvent('alert alert-danger alert-dismissible fade show', 'Excluído com Sucesso!', `O ID ${id}, não consta mas na Tabela e no Local Sotorage.`);
    }

    function assembleNameList(datas, startButtons) {

        tbNew = Array.prototype.concat(datas);

        tbNew.forEach(data => {
            var buttonEdit = `${data['id']}Edit`;
            var buttonRemove = `${data['id']}Remove`;

            startLine(data, startButtons);
            eventsButtons(buttonEdit, buttonRemove);

        });

        cleanFields();
    }

    function generateId() {
        var id = `_${Math.round(Math.random() * (100 - 3))}`;
        return id;
    }

    function buttons(id) {

        var startButtons = [
            {
                "id": `${id}Edit`,
                "class": "btn btn-outline-primary mr-1",
                "icons": "fa fa-edit",
                "data-toggle": "modal",
                "data-target": "#editTr"
            },
            {
                "id": `${id}Remove`,
                "class": "btn btn-outline-danger",
                "icons": "fa fa-trash-o"
            }
        ];

        return startButtons;
    }

    function cleanFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#surName').value = '';
        document.querySelector('#nickName').value = '';
    }

    function startTags() {
        var elTr = document.createElement('tr');
        var elThId = document.createElement('th');
        var elTdName = document.createElement('td');
        var elTdSurName = document.createElement('td');
        var elTdNickName = document.createElement('td');
        var elTdOptions = document.createElement('td');

        var textId;
        var textName;
        var textSurName;
        var textNickName;

        return { elTr, elThId, elTdName, elTdSurName, elTdNickName, elTdOptions, textId, textName, textSurName, textNickName };
    }

    function startLine(data, startButtons) {
        
        var tags = startTags();

        tags['elTr'].setAttribute('id', `${data['id']}`);

        tags['elThId'].setAttribute('scope', 'row');
        tags['textId'] = document.createTextNode(data['id']);
        tags['elThId'].appendChild(tags['textId']);

        tags['elTdName'].setAttribute('id', 'Name');
        tags['textName'] = document.createTextNode(data['name']);
        tags['elTdName'].appendChild(tags['textName']);

        tags['elTdSurName'].setAttribute('id', 'SurName');
        tags['textSurName'] = document.createTextNode(data['surName']);
        tags['elTdSurName'].appendChild(tags['textSurName']);

        tags['elTdNickName'].setAttribute('id', 'NickName');
        tags['textNickName'] = document.createTextNode(data['nickName']);
        tags['elTdNickName'].appendChild(tags['textNickName']);

        tags['elTdOptions'].setAttribute('id', 'Options');

        tags['elTr'].appendChild(tags['elThId']);
        tags['elTr'].appendChild(tags['elTdName']);
        tags['elTr'].appendChild(tags['elTdSurName']);
        tags['elTr'].appendChild(tags['elTdNickName']);

        startButtons.forEach(oneButton => {

            var button = initButtons(oneButton);

            button.setAttribute('data-id', data['id']);

            tags['elTdOptions'].appendChild(button);
            tags['elTr'].appendChild(tags['elTdOptions']);

        });

        elTbody.appendChild(tags['elTr']);
    }

    function initButtons(oneButton) {
        var elButton = document.createElement('button');
        var elIcon = document.createElement('i');

        elButton.setAttribute('id', oneButton['id']);
        elButton.setAttribute('class', oneButton['class']);

        elIcon.setAttribute('class', oneButton['icons']);
        elButton.appendChild(elIcon);

        return elButton;
    };

    function eventsButtons(buttonEdit, buttonRemove) {
        var elButtonEdit = document.querySelector(`#${buttonEdit}`);
        var elButtonRemove = document.querySelector(`#${buttonRemove}`);

        elButtonRemove.addEventListener("click", function () {
            var id = this.dataset.id;
            if (confirm("Você realmente deseja excluir a linha (TR)?")) {
                removeLocalStorage(id);
            }
        });

        elButtonEdit.addEventListener("click", function () {
            var id = this.dataset.id;
            var elTrEdit = actionSelect(id);

            var txtName = elTrEdit.querySelector('#Name').innerHTML;
            var txtSurName = elTrEdit.querySelector('#SurName').innerHTML;
            var txtNickName = elTrEdit.querySelector('#NickName').innerHTML;

            document.querySelector('#idModal').value = id;
            document.querySelector('#nameModal').value = txtName;
            document.querySelector('#surNameModal').value = txtSurName;
            document.querySelector('#nickNameModal').value = txtNickName;

            $('#editTr').modal('show');

            
        });
    }

    function actionSelect(id) {
        var elTrAction = document.querySelector(`#${id}`);
        return elTrAction;
    }

    function checkInclude(id, nickName){
        var elCheckId = document.querySelectorAll('tbody tr');
        var sizeTr = elCheckId.length;
        var checkNickName = false;

        for (var i=0; i < sizeTr; i++) {
            var idTr = elCheckId[i].querySelector('th').innerHTML;
            var nickNameTr = elCheckId[i].querySelectorAll('tr #NickName');

            
            if (nickNameTr[0].innerHTML === nickName){
                console.log(nickNameTr[0].innerHTML);
                checkNickName = true;
            }
            
            
            if (id === idTr) {
                var id = generateId();
                checkInclude(id);
            }
        }

        return { id, checkNickName };
    }

})()