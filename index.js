it('should work', async function () {
    console.log('it works!');
    console.log('contex works!', this);
    this.a = await Promise.resolve(15);
    console.log('context updated!', this);
    throw new Error('qwe');
});
