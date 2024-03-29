import { Alert, CircularProgress, Stack } from '@mui/material'
import {
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  ValueFormatterParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import '../../css/charts.css'
import { tradingDataDef } from '../DataManagement'
import { filterSlice } from '../StateManagement'

function Screening(data: { tradingData: tradingDataDef }) {
  const gridRef = useRef<AgGridReact>(null)
  const containerStyle = useMemo(() => ({ width: '100%', height: '210px' }), [])
  const gridStyle = useMemo(() => ({ width: '100%', height: '210px' }), [])
  const [rowData, setRowData] = useState<any[]>()
  const [gridApi, setGridApi] = useState<GridApi>()

  function defaultValueFormat(params: ValueFormatterParams) {
    return params.value ? `${Number(params.value * 100).toFixed(2)}%` : ''
  }

  const [columnDefs] = useState<ColDef[]>([
    { field: 'pair' },
    { field: 'close' },
    {
      field: '24h_change',
      valueFormatter: (params) => defaultValueFormat(params),
      cellClassRules: { 'bold-and-red': 'x<1' },
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
    { field: 'next_support' },
    { field: 'next_resistance' },
    {
      field: 'support_dist',
      valueFormatter: (params) => defaultValueFormat(params),
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
    { field: 'rsi' },
    {
      field: 'bbl',
      valueFormatter: (params) => defaultValueFormat(params),
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
    {
      field: 'technicals_score',
      valueFormatter: (params) => defaultValueFormat(params),
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
    {
      field: 'book_imbalance',
      type: 'number',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => defaultValueFormat(params),
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
    {
      field: 'spread',
      valueFormatter: (params) => defaultValueFormat(params),
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
    {
      field: 'potential_gain',
      type: 'number',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => defaultValueFormat(params),
      cellStyle: (params) => {
        return { color: params.value < 0 ? 'red' : 'green' }
      },
    },
  ])
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
      enableCellChangeFlash: true,
      valueSetter: (params: any) => {
        return params.newValue
      },
    }
  }, [])

  const dispatch = useDispatch()

  useEffect(() => {
    if (gridApi && data.tradingData.screeningData) {
      const formattedData = formatGridData()
      gridApi.setGridOption('rowData', formattedData)
    }
  }, [gridApi, JSON.stringify(data.tradingData.screeningData)])

  function setDefaultGridSettings(gridApi: any) {
    if (gridApi) {
      const filters = {
        // book_imbalance: {
        //   type: 'notBlank',
        // },
        potential_gain: {
          type: 'greaterThan',
          filter: 0.05,
        },
      }
      gridApi.setFilterModel(filters)
      gridApi.applyColumnState({
        state: [{ colId: 'technicals_score', sort: 'desc' }],
        defaultState: { sort: null },
      })
    }
  }

  function formatGridData() {
    let formattedData: any = []
    Object.keys(data.tradingData.screeningData).forEach((pair: string) => {
      formattedData.push(data.tradingData.screeningData[pair])
    })
    return formattedData
  }

  const onGridReady = useCallback((event: GridReadyEvent) => {
    const formattedData = formatGridData()
    setRowData(formattedData)
    setGridApi(event.api)
    event.api.setGridOption('rowData', formattedData)
    setDefaultGridSettings(event.api)
  }, [])

  const handleClick = (clickedPair: RowClickedEvent<any>) => {
    const pairDetails = clickedPair.data
    dispatch(filterSlice.actions.setPair(pairDetails.pair))
    dispatch(filterSlice.actions.setPairScoreDetails(pairDetails))
    dispatch(filterSlice.actions.setSelectedOrder(['', '', '']))
  }

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => params.data.pair
  }, [])

  return data.tradingData.screeningData === false ? (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: 1, height: '200px' }}
    >
      <Alert severity="error">Could not load screening data.</Alert>
    </Stack>
  ) : data.tradingData.screeningData.length === 0 ? (
    <CircularProgress style={{ marginLeft: '50%', marginTop: '10%' }} />
  ) : (
    <div style={containerStyle}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className={'ag-theme-quartz-dark'} style={gridStyle}>
          <AgGridReact
            getRowId={getRowId}
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={(r) => handleClick(r)}
            onGridReady={onGridReady}
            rowSelection={'single'}
            suppressCopyRowsToClipboard={true}
            //https://github.com/ag-grid/ag-grid/issues/7472
          />
        </div>
      </div>
    </div>
  )
}

export default Screening
