import React, { useCallback, useState } from 'react';
import './App.css';
import { Input } from './components/input/input';
import { Button, EButtonType } from './components/button/button';
import { ImgGroup } from './components/img-list/img-group/img-group';
import { ImgList } from './components/img-list/img-list';

interface ImgItem {
  src: string;
  tag: string;
}

function App() {
  const [items, setItems] = useState<ImgItem[]>([]);
  const [stackTag, setStackTag] = useState<string[]>([]);
  const [currentTag, setTag] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [isWait, setIsWait] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);

  const updateItems = useCallback((url: string, tag: string) => {
    stackTag.indexOf(tag) === -1 && setStackTag([...stackTag, tag]);
    setItems([...items, { src: url, tag }]);
  }, [items, setItems, stackTag, setStackTag]);

  const clearItems = useCallback(() => {
    setStackTag([]);
    setItems([]);
    setIsClear(true);
  }, []);

  const fetchAPI = useCallback((tag: string) => {
    // param is a highlighted word from the user before it clicked the button
    const appKey = 'oj4ilfIlRDtHI5CAtRDP5Bt4L0Vg9Sd9';
    setIsWait(true);
    return fetch(`https://api.giphy.com/v1/gifs/random?api_key=${appKey}&tag=${tag}`);
  }, []);
  let giphs = '';
  const loadItem = useCallback((item: string[]) => {
    let id = 0;
    const makeid = (length: number) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
      }
      return result;
    };
    const revers = () => {
      fetchAPI(currentTag[id]).then(async result => {
        if (result.ok) {
          // если HTTP-статус в диапазоне 200-299
          // получаем тело ответа (см. про этот метод ниже)
          let json = await result.json();
          const url: string = json.data.image_url;
          if (url) {
            if (giphs) {
              giphs = `${giphs} , ${url}`;
            } else {
              giphs = url;
            };
          } else {
            alert('По тегу ничего не найдено');
          }
          id += 1;
          if (currentTag[id]) {
            revers();
          } else {
            updateItems(giphs, item.join(', '));
            setIsWait(false);
            id = 0;
          };
        } else {
          alert("Произошла http ошибка: " + result.status);
        }
      });
    };
    const randomTagCall = () => {
      const randomTag = makeid(Math.round(Math.random() * 10));
      fetchAPI(randomTag).then(async result => {
        if (result.ok) {
          // если HTTP-статус в диапазоне 200-299
          // получаем тело ответа (см. про этот метод ниже)
          let json = await result.json();
          const url: string = json.data.image_url;
          if (!url) {
            randomTagCall();
          } else {
            updateItems(url, randomTag);
            setTimeout(() => {
              randomTagCall();
            }, 5000);
          }
        } else {
          alert("Произошла http ошибка: " + result.status);
        }
      });
    };
    if (item.length === 1 && item[0] === 'delay') {
      setIsWait(true);
      randomTagCall();
    } else {
      revers();
    }
  }, [updateItems, fetchAPI, currentTag, setIsWait, isWait]);

  const buttonClick = useCallback((urls: { tags: string[], group: boolean, type?: EButtonType }) => (): void => {
    if (urls.type === EButtonType.clear) {
      clearItems();
    } else {
      if (!isWait && urls.type === EButtonType.load) {
        //past here
        setIsClear(false);
        loadItem(urls.tags);
      }
    }
  }, [clearItems, loadItem, isWait]);

  return (
    <div className="App">
      <header>
        <div className="App-header-panel">
          <Input setTags={setTag} setIsClear={setIsClear} value={!isClear ? currentTag.join(', ') : ''} />
          <Button
            type={EButtonType.load}
            data={{ setterGroup: setIsGroup, value: isGroup }}
            clickHandle={buttonClick({ tags: currentTag, group: isGroup, type: EButtonType.load })}
          >
            {isWait ? 'Загрузка...' : 'Загрузить'}
          </Button>
          <a href="/">
            <Button
              type={EButtonType.clear}
              data={{ setterGroup: setIsGroup, value: isGroup }}
              clickHandle={buttonClick({ tags: [], group: isGroup, type: EButtonType.clear })}
            >
              Очистить
            </Button>
          </a>
          <Button
            type={EButtonType.group}
            data={{ setterGroup: setIsGroup, value: !isGroup }}
            clickHandle={buttonClick({ tags: currentTag, group: !isGroup, type: EButtonType.group })}
          >
            {!isGroup ? 'Группировать' : 'Разгруппировать'}
          </Button>
        </div>
        {isGroup ?
          (
            stackTag
              .map(
                item => (
                  <ImgGroup
                    items={
                      items
                        .filter(({ tag }) => tag === item)
                        .map(({ src }) => src)
                    }
                    tag={item}
                    key={item}
                  />
                )
              )
          ) : (
            <ImgList
              items={
                items
                  .map(({ src }) => src)
              }
            />
          )
        }
      </header>
    </div>
  );
}

export default App;
