const data = [
  {
    folder: true,
    title: 'Grow',
    children: [
      {
        title: 'logo.png'
      },
      {
        folder: true,
        title: 'English',
        children: [
          {
            title: 'Present_Perfect.txt'
          }
        ]
      }
    ]
  },
  {
    folder: true,
    title: 'Soft',
    children: [
      {
        folder: true,
        title: 'NVIDIA',
        children: null
      },
      {
        title: 'nvm-setup.exe'
      },
      {
        title: 'node.exe'
      }
    ]
  },
  {
    folder: true,
    title: 'Doc',
    children: [
      {
        title: 'project_info.txt'
      }
    ]
  },
  {
    title: 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

function drawTree(tree) {
  let list = document.createElement('ul');

  for (let i = 0; i < tree.length; i++) {
    let li = document.createElement('li');

    if (tree[i].folder) {
      let a = document.createElement('a');
      a.setAttribute('tabindex', '-1');
      a.classList = 'folder';
      a.innerHTML = `<i class="material-icons"> folder </i> <span>${tree[i].title}</span>`;
      li.append(a);
    } else if (!tree[i].folder) {
      let a = document.createElement('a');
      a.setAttribute('tabindex', '-1');
      a.classList = 'file';
      a.innerHTML = `<i class="material-icons"> insert_drive_file </i> <span>${tree[i].title}</span>`;
      li.append(a);
    }

    list.append(li);
    if (tree[i].children) {
      li.append(drawTree(tree[i].children));
      list.append(li);
    } else if (tree[i].folder && !tree[i].children) {
      let newUl = document.createElement('ul');
      newUl.innerHTML = `<li><i>Folder is empty</i></li>`;

      li.append(newUl);
      list.append(li);
    }
  }
  return list;
}

let contextMenu = document.createElement('nav');
contextMenu.classList.add('context-menu');
contextMenu.innerHTML = ` 
<ul class="context-menu__items">
  <li class="context-menu__item">
    <a href="#" class="context-menu__link Rename">
      Rename
    </a>
  </li>
  <li class="context-menu__item">
    <a href="#" class="context-menu__link Delete">
      Delete item
    </a>
  </li>
</ul>`;

rootNode.append(drawTree(data));
rootNode.append(contextMenu);

let nestedUls = document.querySelectorAll('li > ul');
let folders = document.querySelectorAll('.folder');
let listItems = document.querySelectorAll('li');
let aElements = document.querySelectorAll('a');

function hideNestedLists() {
  nestedUls.forEach((list) => list.classList.add('hide'));
}

hideNestedLists();

//Open or hide content of folders
folders.forEach((folder) =>
  folder.addEventListener('click', () => {
    let childrenUl = folder.parentElement.querySelector('ul');
    let folderIcon = folder.querySelector('i');
    childrenUl.classList.toggle('hide');

    if (childrenUl.classList.contains('hide')) {
      folderIcon.innerHTML = 'folder';
    } else {
      folderIcon.innerHTML = 'folder_open';
    }
  })
);

//Context menu creating
let menu = document.querySelector('nav');
let menuOptions = menu.querySelectorAll('li');
let focusedElement;
let focusedElementClosestUl;

//Open context menu on clicking li element
listItems.forEach((li) => {
  li.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.classList.add('context-menu--active');
    menuOptions.forEach((option) => option.classList.remove('disabled'));
    positionMenu(e);
  });
});

function getPointerPosition(event) {
  let x = event.clientX;
  let y = event.clientY;
  return {
    x,
    y
  };
}

function positionMenu(event) {
  let menuPosition = getPointerPosition(event);

  menu.style.left = menuPosition.x + 'px';
  menu.style.top = menuPosition.y + 'px';
}

//Focus and blur elements on right and left clicks accordingly
aElements.forEach((a) => {
  a.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    a.focus();
    focusedElement = document.activeElement;
    focusedElementClosestUl = focusedElement.closest('ul');
  });

  a.addEventListener('click', () => {
    a.blur();
  });
});

//Close context menu on clicking outside context menu
window.addEventListener('click', (e) => {
  if (!e.target.closest('.context-menu')) {
    menu.classList.remove('context-menu--active');
  }
});

//Disable menu if open outside of the item
window.addEventListener('contextmenu', (e) => {
  if (!e.target.closest('.folder') && !e.target.closest('.file')) {
    e.preventDefault();
    menuOptions.forEach((option) => option.classList.add('disabled'));
    menu.classList.add('context-menu--active');
    positionMenu(e);
  }
});

//Implement contextmenu options working onclick
menuOptions.forEach((option) => {
  option.addEventListener('click', (e) => {
    if (e.target.classList.contains('Delete')) {
      focusedElement.parentElement.remove();
      menu.classList.remove('context-menu--active');

      if (!focusedElementClosestUl.querySelector('li')) {
        focusedElementClosestUl.innerHTML = `<li><i>Folder is empty</i></li>`;
      }
    } else if (e.target.classList.contains('Rename')) {
      let span = focusedElement.querySelector('span');
      let spanText = span.textContent;
      let dot = spanText.indexOf('.');
      span.innerHTML = `<input value=${spanText}></input>`;
      let input = span.querySelector('input');

      menu.classList.remove('context-menu--active');

      input.onfocus = () => {
        focusedElement.classList.add('input-focus');
        input.setSelectionRange(0, dot);
      };

      input.select();

      input.onblur = () => {
        focusedElement.classList.remove('input-focus');
        span.innerHTML = input.value;
      };
    }
  });
});
