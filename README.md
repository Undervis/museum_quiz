# Сова Афины

### Установка с помощью Docker

<i>Несмотря на то, что Docker больше в России не работает, есть обходной путь</i>

Необходимо установить прокси зеркало в конфиг Docker
Подробнее в https://huecker.io/use.html

Расположен в:

- Linux, regular setup `/etc/docker/daemon.json`
- Linux, rootless mode    `~/.config/docker/daemon.json`
- macOS    `~/.docker/daemon.json`
- OrbStack Settings -> Docker -> Advanced engine config
- Windows    `C:\ProgramData\docker\config\daemon.json`
- Docker Desktop Preferences -> Docker engine

Добавьте в него следующую строку

*Используется прокси гугла т.к. в прокси с самого сайта нет нужных образов*
```
{
...
"registry-mirrors": ["https://mirror.gcr.io"]
...
}
```

После этого перезагрузите Docker
`systemctl restart docker`
---
### Запуск проекта

Перейдите в папку проекта и выполните 
```
docker-compose build
docker-compose up
```

После этого сайт будет доступен по http://localhost или по адресу машины в локальной сети

---
## ВАЖНО!!!

Для получения ссылки на API используется ссылка самого сайта с припиской порта `8000`

Пример 1: `Адрес: http://localhost` 

Ссылка на API будет: `http://localhost:8000`

Пример 2: `Адрес: http://192.168.0.12` 

Ссылка на API будет: `http://192.168.0.12:8000`

### При изменении порта frontend потеряется доступ к API!

Ссылка создается в `frontend/src/main.js:19`

При необходимости можете вручную прописать адрес к API, но путь `/api` на конце ссылки должен остаться, иначе запросы не выполнятся