### GENDIFF:

[![Actions Status](https://github.com/s-peftev/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/s-peftev/frontend-project-lvl2/actions) [![Actions Status](https://github.com/s-peftev/frontend-project-lvl2/workflows/Node-CI/badge.svg)](https://github.com/s-peftev/frontend-project-lvl2/actions) [![Actions Status](https://api.codeclimate.com/v1/badges/17bbc99ec163ab7261dc/maintainability)](https://codeclimate.com/github/s-peftev/frontend-project-lvl2/maintainability) [![Actions Status](https://api.codeclimate.com/v1/badges/17bbc99ec163ab7261dc/test_coverage)](https://codeclimate.com/github/s-peftev/frontend-project-lvl2/test_coverage")

This CLI app provides comparing of two given configuration files.
Supporting file formats: .json   .yml

### Installation
----------------

```console
git clone git@github.com:s-peftev/frontend-project-lvl2.git
cd frontend-project-lvl2
make install
npm link
```

### Usage
---------

```console
gendiff -h
Usage: gendiff [options] <filepath1> <filepath2>

Compares two configuration files and shows a difference.
Options:
  -V, --version        output the version number
  -f, --format <type>  output format
  -h, --help           display help for command
```

* Comparing JSON

jsonFile1.json
```json
{
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
}
```

jsonFile2.json
```json
{
  "timeout": 20,
  "verbose": true,
  "host": "hexlet.io"
}
```

```console
gendiff jsonFile1.json jsonFile2.json
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
```

* Comparing YAML

yamlFile1.yml
```yaml
host: "hexlet.io"
timeout: 50
proxy: "123.234.53.22"
follow: false
```

yamlFile2.yml
```yaml
timeout: 20
verbose: true
host: "hexlet.io"
```

```console
gendiff yamlFile1.yml yamlFile2.yml
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
```