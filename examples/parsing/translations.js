/* global gettext pgettext ngettext npgettext interpolate */

console.log(gettext(`Dummy test string ${1}`));
console.log(gettext('Dummy test string'));
console.log(gettext('Dummy test string Dummy test string'));
console.log(pgettext('test', 'Dummy test string'));

const waybillCount = 1;
let format = ngettext('There is %s more waybill', 'There are %s more waybills', waybillCount);
interpolate(format, [waybillCount]);

format = npgettext('list', 'There is %(waybillCount)s more waybill', 'There are %(waybillCount)s more waybills', waybillCount);
interpolate(format, null, { waybillCount: 3 });

function TestComponent() {
    return <div>{gettext('Dummy test string')}</div>;
}

function TestComponent2() {
    return (
        <div>{gettext('Dummy test string')}</div>
    );
}


console.log(gettext('Dummy test string'));
console.log(gettext('Dummy "test" string'));

// Test empty string
// console.log(gettext(''));
