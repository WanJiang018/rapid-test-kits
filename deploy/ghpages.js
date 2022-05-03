const path = require('path');
const ghpages = require('gh-pages');

const options = {
    branch: 'gh-pages',
    repo: 'https://github.com/WanJiang018/rapid-test-kits.git'
};

const callback = err => {
    if (err) console.error(err);
    else console.log('publish success');
};
ghpages.publish(path.resolve(__dirname, '../dist'), options, callback);