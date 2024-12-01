import { Document, Model, Schema } from 'mongoose';

/**
 * Định nghĩa kiểu dữ liệu cho kết quả phân trang
 */
interface QueryResult<T> {
    results: T[]; // Kết quả tìm thấy
    page: number; // Trang hiện tại
    limit: number; // Số lượng kết quả tối đa mỗi trang
    totalPages: number; // Tổng số trang
    totalResults: number; // Tổng số tài liệu
}

/**
 * Định nghĩa kiểu dữ liệu cho tùy chọn truy vấn
 */
interface QueryOptions {
    sortBy?: string; // Tiêu chí sắp xếp (vd: "name:asc,createdAt:desc")
    populate?: string; // Trường cần populate (vd: "user.profile")
    limit?: number | string; // Số lượng kết quả mỗi trang
    page?: number | string; // Trang hiện tại
}

/**
 * Hàm paginate
 * @param schema - Schema mongoose để thêm chức năng paginate
 */
const paginate = <T extends Document>(schema: Schema<T>) => {
    schema.statics.paginate = async function (
        filter: Record<string, any>,
        options: QueryOptions,
    ): Promise<QueryResult<T>> {
        let sort = '';
        if (options.sortBy) {
            const sortingCriteria: string[] = [];
            options.sortBy.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }

        let docsPromise = this.find(filter).sort(sort);

        let limit: number, page: number;
        if (!options.limit || options.limit !== 'false') {
            limit =
                options.limit && parseInt(options.limit as string, 10) > 0 ? parseInt(options.limit as string, 10) : 10;
            page = options.page && parseInt(options.page as string, 10) > 0 ? parseInt(options.page as string, 10) : 1;
            const skip = (page - 1) * limit;
            docsPromise = docsPromise.skip(skip).limit(limit);
        }

        const countPromise = this.countDocuments(filter).exec();

        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
                docsPromise = docsPromise.populate(
                    populateOption
                        .split('.')
                        .reverse()
                        .reduce((a, b) => ({ path: b, populate: a }), {} as any),
                );
            });
        }

        docsPromise = docsPromise.exec();

        return Promise.all([countPromise, docsPromise]).then(([totalResults, results]) => {
            if (!limit) {
                page = 1;
                limit = totalResults;
            }
            const totalPages = Math.ceil(totalResults / limit);
            return {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            } as QueryResult<T>;
        });
    };
};

export default paginate;
