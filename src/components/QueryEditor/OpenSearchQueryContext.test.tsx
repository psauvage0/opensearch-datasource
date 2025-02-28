import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { OpenSearchProvider, useDatasource, useQuery } from './OpenSearchQueryContext';
import { OpenSearchQuery } from '../../types';
import { OpenSearchDatasource } from '../../opensearchDatasource';

const query: OpenSearchQuery = {
  refId: 'A',
  query: '',
  metrics: [{ id: '1', type: 'count' }],
  bucketAggs: [{ type: 'date_histogram', id: '2' }],
};

describe('OpenSearchQueryContext', () => {
  it('Should call onChange with the default query when the query is empty', () => {
    const datasource = { timeField: 'TIMEFIELD' } as OpenSearchDatasource;
    const onChange = jest.fn();

    render(<OpenSearchProvider query={{ refId: 'A' }} onChange={onChange} datasource={datasource} />);

    const changedQuery: OpenSearchQuery = onChange.mock.calls[0][0];
    expect(changedQuery.query).toBeDefined();
    expect(changedQuery.alias).toBeDefined();
    expect(changedQuery.metrics).toBeDefined();
    expect(changedQuery.bucketAggs).toBeDefined();

    // Should also set timeField to the configured `timeField` option in datasource configuration
    expect(changedQuery.timeField).toBe(datasource.timeField);
  });

  describe('useQuery Hook', () => {
    it('Should throw when used outside of OpenSearchQueryContext', () => {
      expect(() => {
        renderHook(() => useQuery());
      }).toThrow();
    });

    it('Should return the current query object', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <OpenSearchProvider datasource={{} as OpenSearchDatasource} query={query} onChange={() => {}}>
          {children}
        </OpenSearchProvider>
      );

      const { result } = renderHook(() => useQuery(), {
        wrapper,
      });

      expect(result.current).toBe(query);
    });
  });

  describe('useDatasource Hook', () => {
    it('Should throw when used outside of OpenSearchQueryContext', () => {
      expect(() => {
        renderHook(() => useDatasource());
      }).toThrow();
    });

    it('Should return the current datasource instance', () => {
      const datasource = {} as OpenSearchDatasource;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <OpenSearchProvider datasource={datasource} query={query} onChange={() => {}}>
          {children}
        </OpenSearchProvider>
      );

      const { result } = renderHook(() => useDatasource(), {
        wrapper,
      });

      expect(result.current).toBe(datasource);
    });
  });
});
