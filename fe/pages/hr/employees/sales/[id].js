import { useRouter } from "next/router";
import useSWR from "swr";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import AdminLayout from "../../../../components/AdminLayout";
import axiosInstance from "../../../../utils/axiosInstance";
import AlertMessages from "../../../../components/AlertMessages";
import Link from "next/link";
import {Pagination} from '@mui/material';
import {paginationRecordCount, PAGINATION_COUNT} from '../../../../helper/paginationRecordCount'
import SearchBar from "../../../../components/SearchBar";
import { currencyDisplay, DoubleType } from "../../../../helper/numbers";
import Loader from "../../../../components/Loader";

export default function CreateSales(){
    const router = useRouter();
    //user id
    const { id } = router.query
	const { data: emp } = useSWR(id ? `users/details/${id}/` : '', {
        revalidateOnFocus: false,       
    });
    

    const [pageIndex, setPageIndex] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchText, setSearchText] = useState('')
	const { data: sales, mutate } = useSWR(id ? `hr/sales/${id}/?search=${searchText}&page=${pageIndex}&from=${fromDate}&to=${toDate}` : '', {
        revalidateOnFocus: false,       
    });

	const [status, setStatus] = useState({
		error: false,
		loading: false,
		success: false,
		infoMessage: '',
	})
    function handleDelete(id){
        if (confirm(`Are you sure you want to delete id ${id}`)) {
            setStatus({ 
                error: false, 
                success: false, 
                loading:true, 
                infoMessage: 'Deleting sale' 
            })
            axiosInstance.delete(`hr/sales/${id}/`)
            .then((_e) => {
                setPageIndex(1)
                mutate()
                setStatus({ 
                    error: false, 
                    success: true, 
                    loading: false, 
                    infoMessage: 'Sale deleted' 
                })
            }).catch((_e) => {
                setStatus({ 
                    error: true, 
                    success: false, 
                    loading: false, 
                    infoMessage: 'Something went wrong.' 
                })
            })
        }    
    }

    //search
    const onKeyUpSearch = (e) => {
        if(e.code === 'Enter')
            setSearchText(e.target.value)
    }

    const onChangeSearch = (e) => {
        if(e.target.value === ''){
            setSearchText('')
        }
    }

    //filter
    useEffect(() => {
        //jan 1
        setFromDate(`${dayjs().year()}-01-01`)
        //current year
        const d = new Date()
        d.setDate(d.getDate() + 1);
        setToDate(d.toISOString().slice(0, 10))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setFromDateValue = (e) => {
        setFromDate(e.target.value)
        setPageIndex(1)
    }

    const setToDateValue = (e) => {
        setToDate(e.target.value)
        setPageIndex(1)
    }

    return (
        <AdminLayout
            title="Sales"
            hasBack={true}
        >
            <div className="flex gap-[50px]">
                <div> 
                    <span className="text-gray-500">Name: </span>
                    <span>{emp?.user_employee?.firstname} {emp?.user_employee?.mi}. {emp?.user_employee?.lastname}</span>
                </div>
                <div> 
                    <span className="text-gray-500">Department: </span>
                    <span> {emp?.user_employee?.position?.title}</span>
                </div>
            </div>
            <div className="mt-1">
                <span className="text-gray-500">Date Hired: </span>
                <span> {dayjs(emp?.user_employee?.date_hired).format('MMMM DD, YYYY')} </span>
            </div>
            <div className="mt-1">
                <span className="text-gray-500">Total Sales: </span>
                ₱&nbsp;
                {sales?.employee?.total_sales ? currencyDisplay(DoubleType(sales?.employee?.total_sales)): 0}
            </div>
            <div className="flex justify-end py-2">
                <Link 
                    className="ml-3 text-blue-500"
                    href={`/hr/employees/sales/create/${id}`}
                >
                    Add Sales
                </Link>
            </div>
            <div className="flex justify-between items-center">
                <SearchBar
                    onChange={onChangeSearch}
                    onKeyUp={onKeyUpSearch}
                    text={searchText}
                    setText={setSearchText}
                    placeholder="Search and Enter | Item Deal"
                    className="!w-[320px]"
                />
                <div>
                    <div className="flex items-center gap-3">
                        <div>From: &nbsp;</div>
                        <input 
                            value={fromDate}
                            onChange={setFromDateValue}
                            type="date" 
                            className="input !mt-0 !w-[200px]" />
                        To: &nbsp;
                        <input 
                            value={toDate}
                            onChange={setToDateValue}
                            type="date" 
                            className="input !mt-0 !w-[200px]" />
                    </div>
                    <div className="text-xs mt-1 text-right">Month\Date\Year</div>
                </div>
            </div>
            <AlertMessages
                className="mb-3"
                error={status.error}
                success={status.success}
                loading={status.loading}
                message={status.infoMessage}
            />
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="w-full inline-block align-middle">
                        <div className="overflow-hidden border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">
                                            Id
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">
                                            Item Deal
                                        </th>
                                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">
                                            Amount
                                        </th>
                                        <th 
                                            style={{width: '200px'}}
                                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {!sales ? (
                                        <tr>
                                            <td 
                                                colSpan="6"
                                                className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap text-center">
                                                    <Loader/>
                                            </td>
                                        </tr>
                                    ):(
                                        !sales?.results?.length && (
                                            <tr>
                                                <td 
                                                    colSpan="5"
                                                    className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap text-center">
                                                        No record Found
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    {sales?.results?.map((d) => (
                                        <tr key={d.id}>
                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {d.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {dayjs(d?.date).format('MMMM DD, YYYY')} 
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {d.item_deal}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                ₱ {currencyDisplay(d.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                <div className="flex gap-5">
                                                    <Link
                                                        href={`/hr/employees/sales/edit/${d.id}`}
                                                        className="text-indigo-500 hover:text-indigo-700"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(d.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-3 pl-2">
                            <div>
                                {paginationRecordCount(pageIndex, sales?.count)}
                            </div>
                            <Pagination 
                                    count={sales?.count ? Math.ceil(sales?.count/PAGINATION_COUNT) : 0}
                                    page={pageIndex}
                                    color="primary"
                                    onChange={(_e, n) => setPageIndex(n)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}