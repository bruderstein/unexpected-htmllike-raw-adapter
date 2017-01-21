
import React from 'react';
import Unexpected from 'unexpected';

import RawAdapter from '../';
import DummyAdapter from './DummyAdapter';

const expect = Unexpected.clone();


describe('RawAdapter', () => {

    let adapter;

    beforeEach(() => {
        adapter = new RawAdapter();
    });

    describe('getName()', () => {

        it('gets the name of a native component', () => {

            const tree = { type: 'span', attributes: {} };
            expect(adapter.getName(tree), 'to equal', 'span');
        });

    });

    describe('getAttributes()', () => {

        it('gets standard string attributes', () => {

            const tree = { type: 'span', props: { test1: 'foo', test2: 'bar' } };
            expect(adapter.getAttributes(tree), 'to equal', {
                test1: 'foo',
                test2: 'bar'
            });
        });

        it('gets numeric attributes', () => {

            const tree = { type: 'span', props: { test1: 42, test2: 305.12 } };
            expect(adapter.getAttributes(tree), 'to equal', {
                test1: 42,
                test2: 305.12
            });
        });

        it('gets object attributes', () => {

            const tree = { type: 'span', props: { test1: { test: 'foo', num: 42 } } };
            expect(adapter.getAttributes(tree), 'to equal', {
                test1: { test: 'foo', num: 42 }
            });
        });
    });

    describe('setOptions()', () => {

        it('sets an option', () => {

            adapter.setOptions({ someOption: true });
            expect(adapter.getOptions(), 'to satisfy', { someOption: true });
        });
    });

    describe('getChildren()', () => {

        it('gets an empty array when there are no children', () => {

            const tree = { type: 'span', props: {} };
            expect(adapter.getChildren(tree), 'to equal', []);
        });

        it('gets an array with one string child', () => {

            const tree = { type: 'span', props: {}, children: [ 'foo' ] };
            expect(adapter.getChildren(tree), 'to equal', [ 'foo' ]);
        });

        it('gets an array with one numeric child', () => {

            const tree = { type: 'span', props: {}, children: [ 42 ] };
            expect(adapter.getChildren(tree), 'to equal', [ 42 ]);
        });

        it('gets an array with a component child', () => {

            const tree = {
            type: 'span',
                props: {},
                children: [
                    {
                        type: 'div',
                        props: {},
                        children: ['some text']
                    }
                  ]
            };
            expect(adapter.getChildren(tree), 'to equal', [ { type: 'div', props: {}, children: [ 'some text' ] } ]);
        });

        it('gets an array with several component children', () => {

            const tree = {
                type: 'span',
                props: {},
                children: [
                    {
                        type: 'div',
                        props: {},
                        children: [ 'some text' ]
                    },
                    {
                        type: 'div',
                        props: {},
                        children: [ 'foo' ]
                    },
                    {
                        type: 'span',
                        props: {
                            attrib: 'hello world'
                        },
                        children: [ 'cheese' ]
                    }
                ]
            };

            expect(adapter.getChildren(tree), 'to equal', [
                { type: 'div', props: {}, children: ['some text'] },
                { type: 'div', props: {}, children: ['foo'] },
                { type: 'span', props: { attrib: 'hello world' }, children: [ 'cheese' ] }
            ]);
        });

        it('does not concat text children by default', () => {

            const tree = {
                type: 'span',
                props: {},
                children: [ 'Hello ', 42, ' world' ]
            };

            expect(adapter.getChildren(tree), 'to equal', [
                'Hello ', 42, ' world'
            ]);
        });

        it('does concat text children when concatTextContent is true', () => {

            const tree = {
                type: 'span',
                props: {},
                children: [ 'Hello ', 42, ' world' ]
            };
            adapter.setOptions({ concatTextContent: true })

            expect(adapter.getChildren(tree), 'to equal', [
                'Hello 42 world'
            ]);
        });

        it('converts content to strings when `convertToString` option is true', () => {

            const tree = {
                type: 'span',
                props: {},
                children: [ 'Hello ', 42, ' world' ]
            };
            adapter.setOptions({ convertToString: true });

            expect(adapter.getChildren(tree), 'to equal', [
                'Hello ', '42', ' world'
            ]);
        });

        it('converts content with null when `convertToString` option is true', () => {

            const tree = {
                type: 'span',
                props: {},
                children: [ 'Hello ', null, ' world' ]
            };
            adapter.setOptions({ convertToString: true });

            expect(adapter.getChildren(tree), 'to equal', [
                'Hello ', ' world'
            ]);
        });

        it('converts only raw content to strings', () => {

            const tree = {
                type: 'div',
                props: {},
                children: [
                    {
                        type: 'span',
                        props: {},
                        children: [ 'Hello world ', 21 ]
                    },
                    {
                        type: 'span',
                        props: {},
                        children: [ 42 ]
                    }
                ]
            };
            adapter.setOptions({ convertToString: true });

            expect(adapter.getChildren(tree), 'to equal', [
                { type: 'span', props: {}, children: ['Hello world ', 21] },
                { type: 'span', props: {}, children: [ 42 ] }
            ]);
        });

        it('converts multiple raw content to strings using `convertMultipleRawToStrings:true`', () => {

            const tree = { type: 'span', props: {}, children: ['Hello world ', 21] };
            adapter.setOptions({ convertMultipleRawToStrings: true });

            expect(adapter.getChildren(tree), 'to equal', [
                'Hello world ', '21'
            ]);
        });

        it('leaves single raw content alone with `convertMultipleRawToStrings:true`', () => {

            const tree = { type: 'span', props: {}, children: [ 21 ] };
            adapter.setOptions({ convertMultipleRawToStrings: true });

            expect(adapter.getChildren(tree), 'to equal', [
                21
            ]);
        });

        it('leaves content when there is only one item, after ignoring `null`s', () => {

            const tree = { type: 'span', props: {}, children: [ null, 21 ] };
            adapter.setOptions({ convertMultipleRawToStrings: true });

            expect(adapter.getChildren(tree), 'to equal', [ 21 ]);
        });

        it('does not ignore boolean elements', () => {
            // I'm not sure what is "right" in this case
            // If we've produced it, we should allow it here, otherwise the readers and writers mismatch
            // On the other hand, booleans are ignored by react, so what business does it have here?
            const tree = {
                type: 'span',
                props: {},
                children: [ true ]
            };
            expect(adapter.getChildren(tree), 'to equal', [ true ]);
        });
    });
    
    it('returns a className prop as a className', () => {

        const tree = {
            type: 'span',
            props: { className: 'abc' }
        };
        expect(adapter.getAttributes(tree), 'to equal', { className: 'abc' });
    });

    it('returns the correct classAttributeName', () => {

        expect(adapter.classAttributeName, 'to equal', 'className');
    });
    
    describe('serialize', function () {
        
        let dummyAdapter;
        beforeEach(function () {
            dummyAdapter = new DummyAdapter();
        })
        
        it('converts a single node', function () { 
            const original = { type: 'span', props: { className: 'foo' } };
            const dummyElement = dummyAdapter.makeDummy(original);
            expect(adapter.serialize(dummyAdapter, dummyElement), 'to satisfy', original);
        });
        
        it('converts a node with child nodes', function () {
            const original = { 
                type: 'span', 
                props: { className: 'foo' },
                children: [ { type: 'div', props: { id: 'bar' } }]
            };
            const dummyElement = dummyAdapter.makeDummy(original);
            expect(adapter.serialize(dummyAdapter, dummyElement), 'to satisfy', original);
        });

        it('converts a node with mixed content child nodes', function () {
            const original = {
                type: 'span',
                props: { className: 'foo' },
                children: [ { type: 'div', props: { id: 'bar' } }, 'hello', 42, { type: 'span', props: {}, children: ['baz' ] } ]
            };
            const dummyElement = dummyAdapter.makeDummy(original);
            expect(adapter.serialize(dummyAdapter, dummyElement), 'to satisfy', original);
        });
    });
    
    describe('isRawElement', function () {
        
        let dummyAdapter;
        beforeEach(function () {
            dummyAdapter = new DummyAdapter();
        });
        
        it('returns true from something from a convertFromOther', function () {
            const original = { type: 'span', props: { className: 'foo' } };
            const dummyElement = dummyAdapter.makeDummy(original);
            const converted = adapter.serialize(dummyAdapter, dummyElement);
            expect(adapter.isRawElement(converted), 'to be true');
        });
        
        it('returns false on an object with type,props and children', function () {
            const original = { type: 'span', props: { className: 'foo' }, children: [] };
            expect(adapter.isRawElement(original), 'to be false');
        });
        
        it('returns true on a deserialized object with type,props and children', function () {
            const original = { type: 'span', props: { className: 'foo' }, children: [] };
            expect(adapter.isRawElement(adapter.deserialize(original)), 'to be true');
        });
    });
    
    describe('function prop deserialization', function () {
       
        it('deserializers a function to include the _isRawDeserializedFunction property', function () {
           
            const original = { type: 'span', props: { onClick: function doSomething() { } } };
            const deserialized = adapter.deserialize(original);
            expect(deserialized.props.onClick, 'to have properties', { _isRawDeserializedFunction: true });
        });
    });
});
